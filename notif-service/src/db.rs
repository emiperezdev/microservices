use mongodb::{Client, Collection, error::Result};
use crate::models::Notification;

pub async fn init() -> Result<Collection<Notification>> {
    println!("[DB] Connecting to MongoDB at mongodb://mongo:27017...");

    let client = Client::with_uri_str("mongodb://mongo:27017").await?;
    println!("[DB] Connection established.");

    let db = client.database("microservices");
    println!("[DB] Using database: microservices");

    let collection = db.collection::<Notification>("notifications");
    println!("[DB] Using collection: notifications");

    Ok(collection)
}
