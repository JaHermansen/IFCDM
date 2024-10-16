import { FragmentIdMap } from "./base-types";
export declare class FragmentUtils {
    static combine(maps: FragmentIdMap[]): FragmentIdMap;
    static intersect(maps: FragmentIdMap[]): FragmentIdMap;
    static export(map: FragmentIdMap): string;
    static import(serializedMap: string): FragmentIdMap;
}
