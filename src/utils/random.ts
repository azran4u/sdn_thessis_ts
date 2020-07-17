import _ from 'lodash';
import { Range } from '../config';
import { LAYER } from '../model';

export class Random {

    static layer(): LAYER {
        const randomIndex = Math.floor(Math.random() * 3);
        if (randomIndex === 0) return 'BASE';
        else if (randomIndex === 1) return "EL1";
        else return "EL2";
    }

    static randomNumericEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    static randomStringEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum) as unknown as T[keyof T][];
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    static stringLiteral<T>(str: T): T[keyof T] {
        return str[0];
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