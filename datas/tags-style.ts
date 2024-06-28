export type TagsStyleType = {
    [key: string]: string
};


/**
 * Datas to apply style to text
 */
export const tagsStyleList: TagsStyleType = {
    '[red]': '<span class="color-red">',
    '[blue]': '<span class="color-blue">',
    '[green]': '<span class="color-green">',
    '[yellow]': '<span class="color-yellow">',
    '[orange]': '<span class="color-orange">',
    '[purple]': '<span class="color-purple">',
    '[white]': '<span class="color-white">',
    '[black]': '<span class="color-black">',
    '[brown]': '<span class="color-brown">',
    '[bg-red]': '<span class="background-red">',
    '[bg-blue]': '<span class="background-blue">',
    '[bg-green]': '<span class="background-green">',
    '[bg-yellow]': '<span class="background-yellow">',
    '[bg-orange]': '<span class="background-orange">',
    '[bg-purple]': '<span class="background-purple">',
    '[bg-white]': '<span class="background-white">',
    '[bg-black]': '<span class="background-black">',
    '[bg-brown]': '<span class="background-brown">',
    '[b]': '<span class="bold">',
    '[i]': '<span class="italic">',
    '[u]': '<span class="underline">',
    '[#]': '<span class="hashtag">',
    '[code]': '<span class="code">',
    '[key]': '<span class="keyboard-key">',
    '[!red!]': '<div class="border-red"><p>',
    '[!green!]': '<div class="border-green"><p>',
    '[!yellow!]': '<div class="border-yellow"><p>',
    '[url=""]': '<a href="" class="link">',
    '[file=""]': '<a href="" class="file">'
}
