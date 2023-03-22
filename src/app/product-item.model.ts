export class ProductItem {
  constructor(
    public imageSrc: string,
    public name: string,
    public description: string,
    public price: number,
    public code: string,
    public services: ProductItem[]
  ) {}
}
