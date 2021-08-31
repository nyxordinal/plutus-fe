export interface User {
    id: number
    name: string
    email: string
}

export interface Expense {
    id: number
    name: string
    typeId: number
    price: number
    date: Date
}

export interface Income {
    id: number
    source: string
    amount: number
    date: Date
}

export interface Summary {
    yearmonth: Date
    amount: number
}