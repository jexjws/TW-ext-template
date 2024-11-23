import md5 from "md5";
import { Extensions } from ".";
import { ElementContext, GlobalResourceMachine, HexColorString } from "./internal";
import { DataStorer, Extension } from "./structs";
export namespace GlobalContext {
    let context: GlobalResourceMachine = Extensions.getFSContext() as GlobalResourceMachine;
    export function createDataStore<T extends { [key: string]: any }>(forExt: new () => Extension, datas: T): DataStorer<T> {
        let { id } = new forExt;
        if (Object.hasOwn(context.EXPORTED, id)) {
            throw new Error(`Data store for FSExtenion "${id}" is already exists.`);
        }
        context.EXPORTED[id] = new DataStorer<T>(datas);
        return context.EXPORTED[id];
    }
    export function destoryDataStore(id: string) {
        if (Object.hasOwn(context.EXPORTED, id)) {
            delete context.EXPORTED[id];
        } else {
            throw new Error(`Data store "${id}" does not exist.`);
        }
    }
    export function getDataStore<T extends { [key: string]: any } = any>(id: string): DataStorer<T> {
        if (Object.hasOwn(context.EXPORTED, id)) {
            return context.EXPORTED[id] as DataStorer<T>;
        } else {
            throw new Error(`Data store "${id}" does not exist.`);
        }
    }
}
export namespace Unnecessary {
    export function elementTree<T extends keyof HTMLElementTagNameMap>(
        tag: T,
        childs: ElementContext[] = []
    ): ElementContext<HTMLElementTagNameMap[T]> {
        let result = document.createElement(tag);
        childs.forEach(child => result.appendChild(child.result));
        return {
            result,
            child(target) {
                result.appendChild(target.result);
                return this;
            },
            class(...classes: string[]) {
                result.classList.add(...classes);
                return this;
            },
            attribute(key, value) {
                result[key] = value;
                return this;
            },
            style(key, value) {
                result.style[key] = value;
                return this;
            },
        };
    }
    export function randomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function randomFloat(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
    export function randomString(length: number, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    export function randomColor(): HexColorString {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }
    export class UUIDAutoscalator {
        private last: number = 1;
        private length: number = 4;
        next(): string {
            let result = [];
            for (let i = 0; i < this.length; i++) {
                this.last++;
                result.push(md5(this.last + i.toString()).slice(0, 5));
            }
            return result.join('-');
        }
        constructor(length: number = 4) {
            this.length = length;
        }
    }
    export function splitArgBoxPart(str: string, substrings: string[]) {
        const substringSet = new Set(substrings);
        const filteredSubstrings = [];
        for (let i = 0; i < str.length; i++) {
            for (const substring of substrings) {
                if (str.startsWith(substring, i)) {
                    filteredSubstrings.push(substring);
                    i += substring.length - 1;
                    break;
                }
            }
        }
        return filteredSubstrings;
    }
    export function splitTextPart(str: string, separators: string[]) {
        const regex = new RegExp(separators.map(s => s.replaceAll("$", "\\$")).join('|'), 'g');
        const result = str.split(regex);
        return result;
    }
    export function hexToRgb(str: HexColorString): number[] {
        let hexs: any[] = [];;
        let reg = /^\#?[0-9A-Fa-f]{6}$/;
        if (!reg.test(str)) throw new Error('Invalid hex color string');
        str = str.replace('#', '') as HexColorString;
        hexs = str.match(/../g) || [];
        for (let i = 0; i < hexs.length; i++) hexs[i] = parseInt(hexs[i], 16);
        return hexs;
    }
    export function darken(color: HexColorString, level: number): HexColorString {
        let rgb = hexToRgb(color);
        for (let i = 0; i < 3; i++) {
            rgb[i] = Math.floor(rgb[i] - (rgb[i] * level))
        }
        return `#${rgb.map((i) => i.toString(16).padStart(2, "0")).join('')}`;
    }
    export function lighten(color: HexColorString, level: number): HexColorString {
        let rgb = hexToRgb(color);
        for (let i = 0; i < 3; i++) {
            rgb[i] = Math.floor(rgb[i] + (255 - rgb[i]) * level)
        }
        return `#${rgb.map((i) => i.toString(16).padStart(2, "0")).join('')}`;
    }
}