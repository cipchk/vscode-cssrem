export class CssRemProcess {

    constructor(private cog: any) { }

    private rePx: RegExp = /([\d.]+)p(x)?/;

    private rePxAll: RegExp = /([\d.]+)px/g;

    /**
     * 换px转换成rem
     * 
     * @private
     * @param {string} pxStr 
     */
    private pxToRem(pxStr: string) {
        const px = parseFloat(pxStr);
        let remValue: number | string = +(px / this.cog.rootFontSize).toFixed(this.cog.fixedDigits);
        if (this.cog.autoRemovePrefixZero) {
            if (remValue.toString().startsWith('0.'))
                remValue = remValue.toString().substring(1);
        }
        return { px: pxStr, pxValue: px, remValue, rem: remValue + 'rem'  };
    }

    /**
     * px转rem
     * 
     * @param {string} text 需要转换文本，例如：10px 12p
     * @return {Object} { px: '10px', pxValue: 10, rem: '1rem', remValue: 1 }
     */
    convert(text: string) {
        let match = text.match(this.rePx);
        if (!match) return null;

        return this.pxToRem(match[1]);
    }

    /** 批量转换 */
    convertAll(code: string): string {
        if (!code) return code;

        return code.replace(this.rePxAll, (word: string) => {
            const res = this.pxToRem(word);
            if (res) return res.rem;
            return word;
        });

    }
}