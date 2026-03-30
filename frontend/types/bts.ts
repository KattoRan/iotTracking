export interface BtsStation {
    id: number

    latitude: number
    longitude: number

    mcc?: number
    mnc?: number
    lac?: number
    cid?: number

    radio?: string
    radius?: number
    address?: string

    status?: 'active' | 'inactive'
}