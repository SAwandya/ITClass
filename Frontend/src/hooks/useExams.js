import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

const apiClient = new APIClient("/exam");

const useExams = () =>
  useQuery({
    queryKey: ["exam"],
    queryFn: () => apiClient.getAll(),
  });

export default useExams;
