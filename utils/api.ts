import axios from "axios";
import { Order } from "./types";
import { getStoredAuth } from "./auth";

interface FetchOrdersParams {
  page?: number;
  status?: string;
  searchQuery?: string;
  searchType?: "all" | "email" | "id" | "name";
}

export const fetchOrders = async ({
  page = 1,
  status = "all",
  searchQuery = "",
  searchType = "all",
}: FetchOrdersParams = {}): Promise<{
  orders: Order[];
  totalPages: number;
}> => {
  const auth = await getStoredAuth();
  if (!auth) {
    throw new Error("Not authenticated");
  }

  try {
    const params: Record<string, string | number> = {
      consumer_key: auth.consumerKey,
      consumer_secret: auth.secretKey,
      per_page: 20,
      page,
    };

    if (status !== "all") {
      params.status = status;
    }

    if (searchQuery) {
      if (searchType === "all") {
        params.search = searchQuery;
      } else {
        switch (searchType) {
          case "email":
            params.customer = searchQuery;
            break;
          case "id":
            params.search = searchQuery;
            break;
          case "name":
            params.customer = searchQuery;
            break;
        }
      }
    }

    const response = await axios.get(`${auth.endpoint}/wp-json/wc/v3/orders`, {
      params,
    });

    return {
      orders: response.data,
      totalPages: parseInt(response.headers["x-wp-totalpages"] || "1"),
    };
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch orders");
  }
};
