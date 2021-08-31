export enum EXPENSE_TYPE {
    FOOD_TYPE = 1,
    TRANSPORTATION_TYPE,
    GAMES_TYPE,
    PARK_TYPE,
    ONLINE_PAYMENT_TYPE,
    CLOTHES_TYPE,
    OTHERS_TYPE,
}

export enum EXPENSE_TYPE_STATUS {
    VALID = 1,
    INVALID
}

export const verifyExpenseType = (expenseType: number): EXPENSE_TYPE_STATUS => {
    if (Object.values(EXPENSE_TYPE).includes(expenseType)) {
        return EXPENSE_TYPE_STATUS.VALID
    }
    return EXPENSE_TYPE_STATUS.INVALID
}

export const convertToExpenseType = (expenseType: number): string => {
    switch (expenseType) {
        case EXPENSE_TYPE.FOOD_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.FOOD_TYPE]
        case EXPENSE_TYPE.TRANSPORTATION_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.TRANSPORTATION_TYPE]
        case EXPENSE_TYPE.GAMES_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.GAMES_TYPE]
        case EXPENSE_TYPE.PARK_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.PARK_TYPE]
        case EXPENSE_TYPE.ONLINE_PAYMENT_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.ONLINE_PAYMENT_TYPE]
        case EXPENSE_TYPE.CLOTHES_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.CLOTHES_TYPE]
        case EXPENSE_TYPE.OTHERS_TYPE:
            return EXPENSE_TYPE[EXPENSE_TYPE.OTHERS_TYPE]
        default:
            return EXPENSE_TYPE[EXPENSE_TYPE.OTHERS_TYPE]
    }
}