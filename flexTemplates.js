const CHICK_ICON = "https://cdn-icons-png.flaticon.com/512/2663/2663067.png"; // รูปน้องไก่น่ารัก

function createTaskFlex(title, deadline) {
    return {
        type: "bubble",
        size: "medium",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    position: "absolute",
                    offsetEnd: "-10px",
                    offsetTop: "-10px",
                    size: "xs",
                    aspectMode: "fit"
                },
                {
                    type: "text",
                    text: "บันทึกงานสำเร็จ! ✨",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "md"
                }
            ],
            backgroundColor: "#FF8C2A",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: title,
                    weight: "bold",
                    size: "xl",
                    wrap: true,
                    color: "#333333"
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "lg",
                    spacing: "sm",
                    contents: [
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "🕒 กำหนดส่ง:",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 2
                                },
                                {
                                    type: "text",
                                    text: deadline || "ไม่ระบุ",
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 4
                                }
                            ]
                        }
                    ]
                }
            ],
            paddingAll: "xl"
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "ดูงานทั้งหมด",
                        text: "ขอดูรายการงานทั้งหมด"
                    },
                    style: "secondary",
                    color: "#FFF7ED",
                    height: "sm"
                }
            ],
            paddingAll: "md"
        },
        styles: {
            footer: {
                separator: true
            }
        }
    };
}

function createTaskListFlex(tasks) {
    const taskItems = tasks.slice(0, 5).map(t => ({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
            {
                type: "box",
                layout: "horizontal",
                contents: [
                    {
                        type: "text",
                        text: "✅",
                        size: "xs",
                        flex: 0,
                        margin: "xs"
                    },
                    {
                        type: "text",
                        text: t.title,
                        weight: "bold",
                        size: "sm",
                        wrap: true,
                        flex: 5
                    }
                ]
            },
            {
                type: "text",
                text: `🕒 ${t.deadline}`,
                size: "xs",
                color: "#999999",
                margin: "sm",
                paddingStart: "xxl"
            },
            {
                type: "separator",
                margin: "md",
                color: "#eeeeee"
            }
        ]
    }));

    return {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "รายการงานของคุณ 📋",
                    weight: "bold",
                    color: "#FFFFFF",
                    align: "center"
                }
            ],
            backgroundColor: "#2C3E50"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: taskItems.length > 0 ? taskItems : [
                {
                    type: "text",
                    text: "ไม่มีงานค้างเลย เก่งมาก! 🎉",
                    align: "center",
                    color: "#aaaaaa",
                    margin: "xl"
                }
            ],
            paddingAll: "xl"
        }
    };
}

function createNotificationFlex(title, deadline, timeRemaining) {
    const isUrgent = timeRemaining.includes('1 ชั่วโมง');
    return {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: "https://cdn-icons-png.flaticon.com/512/564/564619.png", // รูปแจ้งเตือนด่วน
                    position: "absolute",
                    offsetEnd: "0px",
                    offsetTop: "0px",
                    size: "xs"
                },
                {
                    type: "text",
                    text: isUrgent ? "⚠️ งานด่วนมาก!" : "🔔 อย่าลืมนะ!",
                    weight: "bold",
                    color: "#FFFFFF"
                }
            ],
            backgroundColor: isUrgent ? "#EF4444" : "#F59E0B",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: title,
                    weight: "bold",
                    size: "lg",
                    wrap: true
                },
                {
                    type: "text",
                    text: `ครบกำหนดในอีก ${timeRemaining}`,
                    size: "md",
                    color: "#EF4444",
                    margin: "sm",
                    weight: "bold"
                },
                {
                    type: "separator",
                    margin: "md"
                },
                {
                    type: "text",
                    text: `กำหนดส่ง: ${deadline}`,
                    size: "xs",
                    color: "#999999",
                    margin: "md"
                }
            ],
            paddingAll: "xl"
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "จัดการตอนนี้เลย",
                        text: `จัดการงาน ${title}`
                    },
                    style: "primary",
                    color: isUrgent ? "#EF4444" : "#F59E0B"
                }
            ]
        }
    };
}

function createGeneralResponseFlex(text) {
    return {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "image",
                            url: CHICK_ICON,
                            size: "xxs",
                            flex: 0,
                            aspectMode: "fit"
                        },
                        {
                            type: "text",
                            text: "Chicku Assistant",
                            size: "xs",
                            weight: "bold",
                            color: "#FF8C2A",
                            margin: "sm",
                            gravity: "center"
                        }
                    ],
                    marginBottom: "md"
                },
                {
                    type: "text",
                    text: text,
                    wrap: true,
                    size: "md",
                    color: "#333333"
                }
            ],
            paddingAll: "xl"
        },
        styles: {
            body: {
                backgroundColor: "#FFF7ED"
            }
        }
    };
}

module.exports = { createTaskFlex, createTaskListFlex, createNotificationFlex, createGeneralResponseFlex };
