import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api-client";

const apiClient = new APIClient("/batch");

const useBatches = () =>
  useQuery({
    queryKey: ["batch"],
    queryFn: () => apiClient.getAll(),
  });

export default useBatches;
