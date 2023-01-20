export interface ChartInterface {
    labels: string[],
    dataset: {
        label: string,
        data: number[],
        borderWidth: number,
    },
}