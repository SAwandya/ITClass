import APIClient from "./api-client";

const apiClient = new APIClient("/event");

class EventService {
  Update(params, event) {
    return apiClient.put(params, event);
  }
  delete(params) {
    return apiClient.delete(params);
  }
  Add(event) {
    return apiClient.post(event)
  }
}

export default new EventService();
