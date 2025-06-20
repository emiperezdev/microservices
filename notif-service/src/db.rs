use mongodb::{Client, Collection, error::Result};
use crate::models::Notification;

pub async fn init() -> Result<Collection<Notification>> {
    println!("[DB] Attempting to connect to MongoDB at mongodb://mongo:27017");

    let client = Client::with_uri_str("mongodb://mongo:27017").await?;
    println!("[DB] Connected to MongoDB");

    let db = client.database("microservices");
    println!("[DB] Using database: microservices");

    let collection = db.collection::<Notification>("notifications");
    println!("[DB] Using collection: notifications");

    Ok(collection)
}
