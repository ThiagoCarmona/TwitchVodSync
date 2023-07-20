import { NotificationInstance } from "antd/lib/notification/interface";

export const sendEndNotification = (title: string, description: string, apiNotification: NotificationInstance) => {
  apiNotification.info({
    message: title,
    description: description,
    placement: "bottomLeft",
    duration: 2,
  })
}