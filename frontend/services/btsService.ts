import { privateClient } from "@/lib/axios";
import type { BtsStation } from "@/types/bts";

const btsService = {
    getByBoundingBox: async (params: {
        west: number;
        south: number;
        east: number;
        north: number;
        zoom: number;
    }): Promise<BtsStation[]> => {
        const res = await privateClient.get("api/v1/bts/map", { params });
        return res.data;
    },
};

export default btsService;