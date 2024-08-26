type CommentTypes = {
    id : number
    title : string
    content : string
    createdOn : string
    stockId : number
}

type AddStockTypes = {
    companyName : string
    industry : string
    lastDiv : number | null
    marketCap : number | null
    purchase : number | null
    symbol : string
}


type StockTypes = {
    id : number
    companyName : string
    industry : string
    lastDiv : number
    marketCap : number
    purchase : number
    symbol : string
    comments : CommentTypes[]
}

export type {StockTypes, AddStockTypes}