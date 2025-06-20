use mongodb::{Client, Collection, error::Result};
use crate::models::Notification;

pub async fn init() -> Result<Collection<Notification>> {
    let client = Client::with_uri_str("mongodb://mongo:27017").await?;
    let db = client.database("notificaciones");
    Ok(db.collection::<Notification>("notifs"))
}
