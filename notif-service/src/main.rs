mod models;
mod db;

use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use mongodb::bson::{doc, oid::ObjectId, DateTime as MongoDateTime};
use futures::stream::TryStreamExt;
use chrono::Utc;
use db::init;
use models::{Notification, NewNotification};
use std::time::SystemTime;

async fn list_notifications(
    db: web::Data<mongodb::Collection<Notification>>,
    user_id: web::Path<String>,
) -> impl Responder {
    let user_oid = match ObjectId::parse_str(&user_id.into_inner()) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().body("ID inválido"),
    };

    let filter = doc! { "user_id": user_oid };
    let mut cursor = db.find(filter, None).await.unwrap();
    let mut results = vec![];
    while let Some(doc) = cursor.try_next().await.unwrap() {
        results.push(doc);
    }

    HttpResponse::Ok().json(results)
}

async fn create_notification(
    db: web::Data<mongodb::Collection<Notification>>,
    data: web::Json<NewNotification>,
) -> impl Responder {
    let user_oid = match ObjectId::parse_str(&data.user_id) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().body("ID inválido"),
    };

    let now = MongoDateTime::from_system_time(SystemTime::now());
    let notif = Notification {
        id: None,
        user_id: user_oid,
        title: data.title.clone(),
        message: data.message.clone(),
        read: false,
        created_at: now,
        updated_at: now,
    };

    match db.insert_one(&notif, None).await {
        Ok(result) => {
            let mut inserted = notif.clone();
            inserted.id = result.inserted_id.as_object_id();
            HttpResponse::Ok().json(inserted)
        }
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

async fn mark_as_read(
    db: web::Data<mongodb::Collection<Notification>>,
    notif_id: web::Path<String>,
) -> impl Responder {
    let oid = match ObjectId::parse_str(&notif_id.into_inner()) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().body("ID inválido"),
    };

    let filter = doc! { "_id": oid };
    let update = doc! {
        "$set": {
            "read": true,
            "updatedAt": MongoDateTime::from_system_time(SystemTime::now())
        }
    };

    let result = db.update_one(filter, update, None).await.unwrap();
    if result.matched_count > 0 {
        HttpResponse::Ok().body("Actualizado")
    } else {
        HttpResponse::NotFound().body("No encontrado")
    }
}

async fn delete_notification(
    db: web::Data<mongodb::Collection<Notification>>,
    notif_id: web::Path<String>,
) -> impl Responder {
    let oid = match ObjectId::parse_str(&notif_id.into_inner()) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().body("ID inválido"),
    };

    let result = db.delete_one(doc! { "_id": oid }, None).await.unwrap();
    if result.deleted_count > 0 {
        HttpResponse::Ok().body("Eliminado")
    } else {
        HttpResponse::NotFound().body("No encontrado")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let collection = init().await.expect("Error al conectar a MongoDB");
    println!("🔔 Microservicio corriendo en http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(collection.clone()))
            .route("/notifications/{user_id}", web::get().to(list_notifications))
            .route("/notifications", web::post().to(create_notification))
            .route("/notifications/{id}/read", web::put().to(mark_as_read))
            .route("/notifications/{id}", web::delete().to(delete_notification))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
