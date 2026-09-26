// Меню ресторана «Окно в Париж», Кизляр. Источник: oknorest.ru (кухня, бар, банкет)
export type Dish = { id: string; name: string; desc: string; price: number | null; priceNote: string | null; img: string | null; tags: string[] };
export type Category = { slug: string; name: string; note: string; items: Dish[] };
export type BarItem = { id: string; name: string; desc: string; price: number | null; priceNote: string | null; img: string | null };
export type BarCategory = { slug: string; name: string; items: BarItem[] };
export type BanketCategory = { name: string; items: { id: string; name: string; price: number }[] };
import { KITCHEN_A } from "./kitchen-a";
import { KITCHEN_B } from "./kitchen-b";
export { BAR, BANKET } from "./bar";
export const KITCHEN: Category[] = [...KITCHEN_A, ...KITCHEN_B];
