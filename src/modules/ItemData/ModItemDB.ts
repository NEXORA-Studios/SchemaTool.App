import MinecraftItemsData from "./minecraft-items.json";

export interface MinecraftItem {
    registerName: string; // 注册名称
    type: string; // 项目类型
    maxStackSize: string; // 最大堆叠数量
    maxDurability: string; // 最大耐久度
    TagList: string[]; // 包含的标签数组
    CreativeTabName: string; // 创造模式选项卡名称
    name: string; // 项目名称
    englishName: string; // 英文名称
    largeIcon: string; // 大图标路径
    smallIcon: string; // 小图标路径
}

export const getMinecraftItem = (itemName: string): MinecraftItem => {
    for (const item of MinecraftItemsData) {
        if (item.name == itemName) return item;
    }
    return {
        "registerName": "liteview:unknown_item",
        "type": "Item",
        "maxStackSize": "64",
        "maxDurability": "0",
        "TagList": [],
        "name": itemName,
        "CreativeTabName": "unknown",
        "englishName": itemName,
        "largeIcon": "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAC3klEQVR4XmP8//8/wygYuSHANBr5IzsERhMAw2gCGC0EGEargNFEMEJDYLQKGK0CRjM/w2gVMJoIGEargNFEMBJDYLQNMNoGGM35o22A0TTAMNoGGE0EDKNtgNFEMOJCYLQRONoIHM32IzkERkuA0RJgtAQYLQFG08BoN3A0DYzMEBhtA4y2AUbz/mgbYDQNjLYBRtPAaBtgNA2MwBAYbQSONgJHM/5oI3A0DYw2AkfTwGgjcDQNjDYCR9PASAuB0V7AaC9gNNeP9gJG08CIDYHRKmC0ChjN/qNVwGgaGK0CRtPAyAyB0TbAaBtgNO+PtgFG08BoG2A0DYy2AUbTwAgMgdFG4GgjcDTjjzYCR9PAaCNwNA2MNgJH08BoI3A0DYy0EBjtBYz2AkZz/WgvYDQNjNgQGK0CRquA0ew/WgWMpoHRKmA0DYzMEBhtA4y2AUbz/mgbYDQNjLYBRtPAaBtgNA2MwBAYbQSONgJHM/5oI3A0DYw2AkfTwGgjcDQNjDYCR9PASAuB0V7AaC9gNNeP9gJG08CIDYHRKmC0ChjN/qNVwGgaGK0CRtPAyAyB0TbAaBtgNO+PtgFG08BoG2A0DYy2AUbTwAgMgdFG4GgjcDTjjzYCR9PAaCNwNA2MNgJH08BoI3A0DYy0EBjtBYz2AkZz/WgvYDQNjNgQGK0CRquA0ew/WgWMpoHRKmA0DYzMEBhtA4y2AUbz/mgbYDQNjLYBRtPAaBtgNA2MwBAYbQSONgJHM/5oI3A0DYw2AkfTwGgjcDQNjDYCR9PASAuB0V7AaC9gNNeP9gJG08CIDYHRKmC0ChjN/qNVwGgaGK0CRtPAyAyB0TbAaBtgNO+PtgFG08BoG2A0DYy2AUbTwAgMgdFG4GgjcDTjjzYCR9PAaCNwNA2MNgJH08BoI3A0DYy0EBjtBYz2AkZz/WgvYDQNjNgQGK0CRquA0ew/WgWMpoHRKmA0DYzMEAAA7XcD/Tl4cvUAAAAASUVORK5CYII=",
        "smallIcon": "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAOUlEQVR4XmP8//8/w0ACJoYBBqMOGA2B0RAYDYHREBgNgdEQGA2B0RAYDYHREBgNgdEQGA2B0RAAAEC0Az0E6HOxAAAAAElFTkSuQmCC"
    };
};