export interface ButtonProps{
    title:string;
    style:string

}
export interface ProductProps{
    price: string;
    image: string;
    plusIcon: string;
    name:string;
    id: string;
    description?: string
}
export interface layoutProps{
  children: React.ReactNode;

}