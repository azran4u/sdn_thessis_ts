import _ from 'lodash';
import { Range } from '../config';

export class Random {
    static randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    static randomFromArray<T>(array: T[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static randomIntFromInterval(range: Range) { // min and max included 
        const min = range.min;
        const max = range.max;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}