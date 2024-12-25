import APIClient from "./api-client";

const apiClient = new APIClient("/event");

class AttendeeService {
  AttendeePost(attendee, params) {
    return apiClient.postOne(attendee, params);
  }
}

export default new AttendeeService();