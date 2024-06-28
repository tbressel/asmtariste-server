"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsStyle = void 0;
class TagsStyle {
    // Constructor
    constructor(tagsStyle) {
        this.tagsStyle = tagsStyle;
    }
    /**
     *
     * Method to apply the style to the text. It transforms [] tags into html tags.
     *
     * @param text
     * @returns
     */
    apply(text) {
        if (text === null)
            return null;
        // Return an Array containing the keys of the tagsStyle object
        Object.keys(this.tagsStyle).forEach(key => {
            // for each key, create a new regular expression to find all occurrences of the key in the text
            const regex = new RegExp(key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "g");
            if (text !== null)
                // Replace all occurrences of the key with the corresponding value in the tagsStyle object
                text = text.replace(regex, this.tagsStyle[key]);
        });
        // Replace some specific spacial tags
        text = text.replace(/\[\/url\]/g, '</a>');
        text = text.replace(/\[\/file\]/g, '</a>');
        text = text.replace(/\[\/!!\]/g, '</p></div>');
        text = text.replace(/\[url="(.*?)"\]/g, '<a class="link" href="$1" target="blank">');
        text = text.replace(/\[file="(.*?)"\]/g, '<a class="file" href="$1" target="blank">');
        text = text.replace(/\[.*?\/.*?]/g, '</span>');
        text = text.replace(/\r/g, '<br>');
        return text;
    }
    /**
     *
     * Method to remove the style from the text. It transforms html tags into [] tags.
     *
     * @param text
     * @returns
     */
    remove(text) {
        if (text === null)
            return null;
        // Replace some specific spacial tags first
        text = text.replace(/<a class="link" href="/g, '[url="');
        text = text.replace(/<a class="file" href="/g, '[file="');
        text = text.replace(/<div class="border-red"><p>/g, '[!red!]');
        text = text.replace(/<div class="border-green"><p>/g, '[!green!]');
        text = text.replace(/<div class="border-yellow"><p>/g, '[!yellow!]');
        text = text.replace(/<\/p><\/div>/g, '[/!!]');
        text = text.replace(/" target="blank">/g, '"]');
        text = text.replace(/<\/a>/g, '[/url]');
        text = text.replace(/<\/span>/g, '[/]');
        text = text.replace(/<br>/g, '\r');
        // Return an Array containing the keys of the tagsStyle object
        Object.keys(this.tagsStyle).forEach(key => {
            // get the value of the key
            const value = this.tagsStyle[key];
            if (value) {
                // for each key, create a new regular expression to find all occurrences of the key in the text
                const escapedValue = value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                const regex = new RegExp(escapedValue, "g");
                if (text !== null)
                    // Replace all occurrences of the key with the corresponding value in the tagsStyle object
                    text = text.replace(regex, key);
            }
        });
        return text;
    }
}
exports.TagsStyle = TagsStyle;
exports.default = TagsStyle;
