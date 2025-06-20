use serde::{Serialize, Deserialize};
use mongodb::bson::{oid::ObjectId, DateTime as MongoDateTime};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Notification {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub title: String,
    pub message: String,
    pub read: bool,
    #[serde(rename = "createdAt")]
    pub created_at: MongoDateTime,
    #[serde(rename = "updatedAt")]
    pub updated_at: MongoDateTime,
}

#[derive(Debug, Deserialize)]
pub struct NewNotification {
    pub user_id: String,
    pub title: String,
    pub message: String,
}
