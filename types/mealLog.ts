import type { Food } from './food';

export type MealLog = {
	id: string;
	source_type: string;
	source_id: string;
	meal_type: string;
	quantity: number;
	date: string;
	photo_url: string | null;
	photo_path: string | null;
	food?: Food | null;
};
