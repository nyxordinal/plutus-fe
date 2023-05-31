import { API } from "@api";
import { Settings } from "@interface/entity.interface";
import { APIResponse, ServiceResponse, SettingsResponse } from "@interface/http.interface";
import { logErrorResponse, snakeCaseKeysToCamelCase } from "@util";

export const getAllSettings = async (): Promise<Settings> => {
    try {
        const r: APIResponse<SettingsResponse> = await API.get('/setting')
        const { settings } = r.data as SettingsResponse
        return snakeCaseKeysToCamelCase(settings)
    } catch (error) {
        logErrorResponse(error)
        return { expenseLimit: 0 }
    }
}

export const updateSettings = async (settings: Settings): Promise<ServiceResponse> => {
    try {
        const r: APIResponse<null> = await API.put('/setting', {
            expense_limit: settings.expenseLimit,
        })
        return { success: true, message: r.message }
    } catch (error) {
        logErrorResponse(error)
        return { success: false, message: logErrorResponse(error) }
    }
}