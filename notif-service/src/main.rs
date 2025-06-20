mod models;
mod db;

use actix_web::{middleware::Logger, web, App, HttpServer, Responder, HttpResponse};
use mongodb::bson::{doc, oid::ObjectId, DateTime as MongoDateTime};
use futures::stream::TryStreamExt;
use chrono::Utc;
use db::init;
use models::{Notification, NewNotification};
use std::time::SystemTime;

async fn ping() -> impl Responder {
    println!("[GET] /ping - Health check");
    HttpResponse::Ok().json(serde_json::json!({ "message": "Hello, world!" }))
}

async fn list_notifications(
    db: web::Data<mongodb::Collection<Notification>>,
    user_id: web::Path<String>,
) -> impl Responder {
    println!("[GET] /notifications/{}", user_id);

    let user_oid = match ObjectId::parse_str(&user_id.into_inner()) {
        Ok(oid) => oid,
        Err(e) => {
            println!("Invalid user_id: {}", e);
            return HttpResponse::BadRequest().body("Invalid ID");
        }
    };

    let filter = doc! { "userId": user_oid };
    let mut cursor = match db.find(filter, None).await {
        Ok(cursor) => cursor,
        Err(e) => {
            println!("Error finding notifications: {}", e);
            return HttpResponse::InternalServerError().body("Error querying notifications");
        }
    };

    let mut results = vec![];
    while let Some(doc) = match cursor.try_next().await {
        Ok(opt) => opt,
        Err(e) => {
            println!("Error iterating cursor: {}", e);
            return HttpResponse::InternalServerError().body("Cursor iteration failed");
        }
    } {
        results.push(doc);
    }

    println!("Found {} notifications", results.len());
    HttpResponse::Ok().json(results)
}

async fn create_notification(
    db: web::Data<mongodb::Collection<Notification>>,
    req_body: web::Json<NewNotification>,
) -> impl Responder {
    println!("[POST] /notifications - Creating new notification");
    println!("Request: {:?}", req_body);

    let user_oid = match ObjectId::parse_str(&req_body.user_id) {
        Ok(oid) => oid,
        Err(e) => {
            println!("Invalid userId: {}", e);
            return HttpResponse::BadRequest().body("Invalid userId");
        }
    };

    let now = MongoDateTime::from_system_time(SystemTime::now());
    let notif = Notification {
        id: None,
        user_id: user_oid,
        title: req_body.title.clone(),
        message: req_body.message.clone(),
        read: false,
        created_at: now,
        updated_at: now,
    };

    match db.insert_one(&notif, None).await {
        Ok(result) => {
            let mut inserted = notif.clone();
            inserted.id = result.inserted_id.as_object_id();
            println!("Notification created with ID: {:?}", inserted.id);
            HttpResponse::Ok().json(inserted)
        }
        Err(e) => {
            println!("Error inserting notification: {}", e);
            HttpResponse::InternalServerError().body("Database insert failed")
        }
    }
}

async fn mark_as_read(
    db: web::Data<mongodb::Collection<Notification>>,
    notif_id: web::Path<String>,
) -> impl Responder {
    println!("[PUT] /notifications/{}/read", notif_id);

    let oid = match ObjectId::parse_str(&notif_id.into_inner()) {
        Ok(oid) => oid,
        Err(e) => {
            println!("Invalid ID: {}", e);
            return HttpResponse::BadRequest().body("Invalid ID");
        }
    };

    let filter = doc! { "_id": oid };
    let update = doc! {
        "$set": {
            "read": true,
            "updatedAt": MongoDateTime::from_system_time(SystemTime::now())
        }
    };

    match db.update_one(filter, update, None).await {
        Ok(result) => {
            if result.matched_count > 0 {
                println!("Notification marked as read: {}", oid);
                HttpResponse::Ok().body("Updated")
            } else {
                println!("Notification not found: {}", oid);
                HttpResponse::NotFound().body("Not found")
            }
        }
        Err(e) => {
            println!("Error updating notification: {}", e);
            HttpResponse::InternalServerError().body("Error updating notification")
        }
    }
}

async fn delete_notification(
    db: web::Data<mongodb::Collection<Notification>>,
    notif_id: web::Path<String>,
) -> impl Responder {
    println!("[DELETE] /notifications/{}", notif_id);

    let oid = match ObjectId::parse_str(&notif_id.into_inner()) {
        Ok(oid) => oid,
        Err(e) => {
            println!("Invalid ID: {}", e);
            return HttpResponse::BadRequest().body("Invalid ID");
        }
    };

    match db.delete_one(doc! { "_id": oid }, None).await {
        Ok(result) => {
            if result.deleted_count > 0 {
                println!("Notification deleted: {}", oid);
                HttpResponse::Ok().body("Deleted")
            } else {
                println!("Notification not found: {}", oid);
                HttpResponse::NotFound().body("Not found")
            }
        }
        Err(e) => {
            println!("Error deleting notification: {}", e);
            HttpResponse::InternalServerError().body("Error deleting notification")
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let collection = init().await.expect("Failed to connect to MongoDB");
    println!("Notification microservice running at http://localhost:8080");

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(web::Data::new(collection.clone()))
            .route("/ping", web::get().to(ping))
            .route("/notifications/{user_id}", web::get().to(list_notifications))
            .route("/notifications", web::post().to(create_notification))
            .route("/notifications/{id}/read", web::put().to(mark_as_read))
            .route("/notifications/{id}", web::delete().to(delete_notification))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
