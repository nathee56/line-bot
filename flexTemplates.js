const CHICK_ICON = "https://cdn-icons-png.flaticon.com/512/2663/2663067.png"; // รูปน้องไก่น่ารัก

function createTaskFlex(title, deadline) {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    position: "absolute",
                    offsetEnd: "0px",
                    offsetTop: "0px",
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
                        text: t.title || "(ไม่มีหัวข้อ)",
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
                margin: "sm"
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
            backgroundColor: "#FF8C2A"
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
                    margin: "md"
                },
                {
                    type: "text",
                    text: text || "...",
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

function createSettingsFlex() {
    return {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "ตั้งค่าการใช้งาน ⚙️",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "md"
                }
            ],
            backgroundColor: "#2C3E50"
        },
        body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "ภาษาที่ใช้งาน",
                            flex: 1,
                            size: "sm",
                            color: "#666666"
                        },
                        {
                            type: "text",
                            text: "ภาษาไทย 🇹🇭",
                            flex: 0,
                            size: "sm",
                            weight: "bold",
                            color: "#FF8C2A"
                        }
                    ]
                },
                {
                    type: "separator"
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "โหมดผู้ช่วย",
                            flex: 1,
                            size: "sm",
                            color: "#666666"
                        },
                        {
                            type: "text",
                            text: "สุภาพ",
                            flex: 0,
                            size: "sm",
                            weight: "bold",
                            color: "#FF8C2A"
                        }
                    ]
                }
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "ลบข้อมูลทั้งหมด",
                        text: "ลบข้อมูลของฉันทั้งหมด"
                    },
                    style: "link",
                    color: "#EF4444"
                }
            ]
        }
    };
}

function createNotificationSettingsFlex() {
    return {
        type: "bubble",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "ตั้งค่าการแจ้งเตือน 🔔",
                    weight: "bold",
                    color: "#FFFFFF"
                }
            ],
            backgroundColor: "#F59E0B"
        },
        body: {
            type: "box",
            layout: "vertical",
            spacing: "lg",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "แจ้งเตือนล่วงหน้า 24 ชม.",
                            size: "sm",
                            gravity: "center"
                        },
                        {
                            type: "button",
                            action: {
                                type: "message",
                                label: "เปิดอยู่ ✅",
                                text: "ตั้งค่าแจ้งเตือน 24 ชม."
                            },
                            height: "sm",
                            style: "secondary",
                            flex: 0
                        }
                    ]
                },
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: "แจ้งเตือนล่วงหน้า 1 ชม.",
                            size: "sm",
                            gravity: "center"
                        },
                        {
                            type: "button",
                            action: {
                                type: "message",
                                label: "เปิดอยู่ ✅",
                                text: "ตั้งค่าแจ้งเตือน 1 ชม."
                            },
                            height: "sm",
                            style: "secondary",
                            flex: 0
                        }
                    ]
                }
            ]
        }
    };
}

function createSummaryDashboardFlex(doneCount, pendingCount) {
    const total = doneCount + pendingCount;
    const progress = total > 0 ? (doneCount / total) * 100 : 0;
    
    return {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "สรุปผลงานของคุณ 🚀",
                    weight: "bold",
                    size: "lg",
                    margin: "md"
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "xl",
                    spacing: "md",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            flex: 1,
                            backgroundColor: "#E8F5E9",
                            paddingAll: "md",
                            cornerRadius: "md",
                            contents: [
                                {
                                    type: "text",
                                    text: "เสร็จแล้ว",
                                    size: "xs",
                                    color: "#2E7D32"
                                },
                                {
                                    type: "text",
                                    text: `${doneCount}`,
                                    weight: "bold",
                                    size: "xl",
                                    color: "#2E7D32"
                                }
                            ]
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            flex: 1,
                            backgroundColor: "#FFF3E0",
                            paddingAll: "md",
                            cornerRadius: "md",
                            contents: [
                                {
                                    type: "text",
                                    text: "ค้างอยู่",
                                    size: "xs",
                                    color: "#E65100"
                                },
                                {
                                    type: "text",
                                    text: `${pendingCount}`,
                                    weight: "bold",
                                    size: "xl",
                                    color: "#E65100"
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "xl",
                    contents: [
                        {
                            type: "text",
                            text: `ความคืบหน้า ${Math.round(progress)}%`,
                            size: "xs",
                            color: "#999999",
                            align: "end"
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            backgroundColor: "#eeeeee",
                            height: "6px",
                            cornerRadius: "xl",
                            margin: "sm",
                            contents: [
                                {
                                    type: "box",
                                    layout: "vertical",
                                    backgroundColor: "#FF8C2A",
                                    width: `${progress}%`,
                                    height: "6px",
                                    contents: []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
}

module.exports = { createTaskFlex, createTaskListFlex, createNotificationFlex, createGeneralResponseFlex, createSettingsFlex, createNotificationSettingsFlex, createSummaryDashboardFlex };
