import { API } from "@api";
import { GetHomeStatResult } from "@interface/dto.interface";
import { APIResponse, HomeStatResponse } from "@interface/http.interface";
import { logErrorResponse } from "@util";

const getHomeStatUrl = "/home/stat"

export const getHomeStat = async (): Promise<GetHomeStatResult> => {
    try {
        const r: APIResponse<HomeStatResponse> = await API.get(getHomeStatUrl);
        const { expense, income } = r.data as HomeStatResponse;
        return {
            expense: {
                total: expense.total,
                average: expense.avg
            },
            income: {
                total: income.total,
                average: income.avg
            }
        };
    } catch (error) {
        logErrorResponse(error);
        return {
            expense: {
                total: 0,
                average: 0
            },
            income: {
                total: 0,
                average: 0
            }
        };
    }
};