const CHICK_ICON = "https://cdn-icons-png.flaticon.com/512/2663/2663067.png";

function getPriorityBadge(priority) {
    if (priority === 'high' || priority === '🔴 ด่วนมาก' || priority === 'ด่วนมาก' || priority === 'ด่วน') return '🔴 ด่วนมาก';
    if (priority === 'medium' || priority === '🟡 ปานกลาง' || priority === 'ปานกลาง') return '🟡 ปานกลาง';
    return '🟢 ปกติ';
}

function taskAddedCard(task) {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "✅ บันทึกแล้ว!",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#22C55E",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    size: "xs",
                    align: "end",
                    position: "absolute",
                    offsetTop: "15px",
                    offsetEnd: "15px"
                },
                {
                    type: "text",
                    text: task.title || "ไม่มีชื่องาน",
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
                            type: "text",
                            text: `🕒 กำหนดส่ง: ${task.deadline || "ไม่ระบุ"}`,
                            color: "#666666",
                            size: "sm",
                            wrap: true
                        },
                        {
                            type: "text",
                            text: `ความสำคัญ: ${getPriorityBadge(task.priority)}`,
                            color: "#666666",
                            size: "sm",
                            wrap: true
                        }
                    ]
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "xl"
        },
        footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "ดูงานทั้งหมด",
                        text: "รายการ"
                    },
                    style: "primary",
                    color: "#FF8C00",
                    height: "sm"
                },
                {
                    type: "text",
                    text: "🐥 Chicku จดให้แล้วนะ!",
                    align: "center",
                    color: "#FF8C00",
                    size: "xs",
                    margin: "md"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "md"
        }
    };
}

function taskListCard(tasks) {
    if (!tasks || tasks.length === 0) {
        return {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "📋 งานของคุณ",
                        weight: "bold",
                        color: "#FFFFFF",
                        size: "lg"
                    }
                ],
                backgroundColor: "#FF8C00",
                paddingAll: "xl"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "image",
                        url: CHICK_ICON,
                        size: "sm",
                        align: "center",
                        margin: "md"
                    },
                    {
                        type: "text",
                        text: "🐥 ไม่มีงานค้างนะ เก่งมาก!",
                        align: "center",
                        color: "#666666",
                        margin: "lg",
                        weight: "bold"
                    }
                ],
                backgroundColor: "#FFF5E6",
                paddingAll: "xl"
            }
        };
    }

    const taskItems = tasks.slice(0, 5).map(t => ({
        type: "box",
        layout: "vertical",
        margin: "md",
        contents: [
            {
                type: "text",
                text: `${getPriorityBadge(t.priority)} ${t.title || "(ไม่มีหัวข้อ)"}`,
                weight: "bold",
                size: "sm",
                wrap: true,
                color: "#333333"
            },
            {
                type: "text",
                text: `🕒 ${t.deadline || "ไม่ระบุ"}`,
                size: "xs",
                color: "#999999",
                margin: "sm"
            },
            {
                type: "button",
                action: {
                    type: "message",
                    label: "✅ เสร็จแล้ว",
                    text: `เสร็จงาน ${t.title}`
                },
                style: "secondary",
                color: "#FFFFFF",
                height: "sm",
                margin: "sm"
            },
            {
                type: "separator",
                margin: "md",
                color: "#FFDDBB"
            }
        ]
    }));

    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "📋 งานของคุณ",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg",
                    align: "center"
                }
            ],
            backgroundColor: "#FF8C00",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: taskItems,
            backgroundColor: "#FFF5E6",
            paddingAll: "xl"
        }
    };
}

function reminderCard(task, timeLeft, urgency) {
    const isUrgent = urgency === "urgent";
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: isUrgent ? "🚨 งานด่วนมาก!" : "⏰ อย่าลืมนะ!",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: isUrgent ? "#EF4444" : "#EAB308",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    size: "xs",
                    align: "end",
                    position: "absolute",
                    offsetTop: "15px",
                    offsetEnd: "15px"
                },
                {
                    type: "text",
                    text: task.title || "ไม่มีชื่องาน",
                    weight: "bold",
                    size: "xl",
                    wrap: true,
                    color: "#333333"
                },
                {
                    type: "text",
                    text: `อีก ${timeLeft}`,
                    color: isUrgent ? "#EF4444" : "#EAB308",
                    size: "md",
                    weight: "bold",
                    margin: "md"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "xl"
        },
        footer: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "button",
                    action: {
                        type: "uri",
                        label: "เปิด Dashboard",
                        uri: `https://line-task-bot-r2p0.onrender.com/index.html?userId=${task.userId}` // This URI will be fixed by the user later if needed, using Render link or similar
                    },
                    style: "primary",
                    color: "#FF8C00",
                    height: "sm"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "md"
        }
    };
}

function completedCard(taskTitle) {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "🎉 เก่งมาก!",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#22C55E",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    size: "sm",
                    align: "center",
                    margin: "md"
                },
                {
                    type: "text",
                    text: "คุณทำงานเสร็จครบแล้ว! พักผ่อนได้นะ 💛",
                    wrap: true,
                    align: "center",
                    color: "#333333",
                    margin: "md",
                    weight: "bold"
                }
            ],
            backgroundColor: "#FFF5E6",
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
                        label: "ดูสรุปงาน",
                        text: "สรุปผลงาน"
                    },
                    style: "primary",
                    color: "#FF8C00",
                    height: "sm"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "md"
        }
    };
}

function scheduleCard(classes) {
    let contents = [];
    if (!classes || classes.length === 0) {
        contents = [
            {
                type: "text",
                text: "ไม่มีเรียนในวันนี้ 🎉",
                align: "center",
                color: "#666666",
                margin: "lg",
                weight: "bold"
            }
        ];
    } else {
        contents = classes.map((c, index) => {
            const isNextClass = index === 0; // Assuming sorted and this is the next one, or handle logic outside
            return {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: `${c.startTime} - ${c.endTime}`,
                        size: "xs",
                        color: isNextClass ? "#FF8C00" : "#666666",
                        weight: isNextClass ? "bold" : "regular",
                        flex: 2
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        flex: 4,
                        contents: [
                            {
                                type: "text",
                                text: c.subject,
                                size: "sm",
                                weight: "bold",
                                color: isNextClass ? "#FF8C00" : "#333333",
                                wrap: true
                            },
                            {
                                type: "text",
                                text: `ห้อง: ${c.room || "-"}`,
                                size: "xs",
                                color: "#999999"
                            }
                        ]
                    }
                ]
            };
        });
    }

    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "📅 ตารางเรียนวันนี้",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#3B82F6",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: CHICK_ICON,
                    size: "xs",
                    align: "end",
                    position: "absolute",
                    offsetTop: "15px",
                    offsetEnd: "15px"
                },
                ...contents
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "xl"
        }
    };
}

function errorCard(message) {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "🐥 อุ๊ปส์!",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#EC4899",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: message || "เกิดข้อผิดพลาดบางอย่าง ขอโทษทีนะ 🥺",
                    wrap: true,
                    align: "center",
                    color: "#333333",
                    margin: "md"
                }
            ],
            backgroundColor: "#FFF5E6",
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
                        label: "ลองใหม่อีกครั้ง",
                        text: "เมนูหลัก"
                    },
                    style: "primary",
                    color: "#FF8C00",
                    height: "sm"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "md"
        }
    };
}

function notificationSettingsCard() {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "⚙️ ตั้งค่าการแจ้งเตือน",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#4B5563",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            spacing: "md",
            contents: [
                {
                    type: "text",
                    text: "ต้องการให้ Chicku เตือนบ่อยแค่ไหนคะ? เลือกรูปแบบที่ต้องการได้เลยจ้า 🐥",
                    wrap: true,
                    color: "#333333",
                    size: "sm"
                },
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "🔔 เตือนทุกระยะ (ดีที่สุด)",
                        text: "เซ็ตแจ้งเตือน: all"
                    },
                    style: "primary",
                    color: "#FF8C00",
                    margin: "md"
                },
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "📅 เตือนล่วงหน้า 1 วัน",
                        text: "เซ็ตแจ้งเตือน: 1day"
                    },
                    style: "secondary",
                    margin: "sm"
                },
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "🚨 เตือนเฉพาะงานด่วน",
                        text: "เซ็ตแจ้งเตือน: urgent"
                    },
                    style: "secondary",
                    margin: "sm"
                },
                {
                    type: "button",
                    action: {
                        type: "message",
                        label: "📴 ปิดการแจ้งเตือน",
                        text: "เซ็ตแจ้งเตือน: off"
                    },
                    style: "link",
                    color: "#EF4444",
                    margin: "sm"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "xl"
        }
    };
}

function howToUseCard() {
    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "📖 วิธีใช้งาน Chicku",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "lg"
                }
            ],
            backgroundColor: "#FF8C00",
            paddingAll: "xl"
        },
        body: {
            type: "box",
            layout: "vertical",
            spacing: "lg",
            contents: [
                {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    contents: [
                        {
                            type: "text",
                            text: "1. การเพิ่มงานใหม่ 📝",
                            weight: "bold",
                            size: "md",
                            color: "#FF8C00"
                        },
                        {
                            type: "text",
                            text: "พิมพ์หาบอทได้เลย เช่น 'ซักผ้า พรุ่งนี้ 8 โมง' หรือกดปุ่ม 'เพิ่มงาน' บน Rich Menu เพื่อเปิดหน้าเว็บจ้า",
                            wrap: true,
                            size: "xs",
                            color: "#666666"
                        }
                    ]
                },
                {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    contents: [
                        {
                            type: "text",
                            text: "2. การดูรายการงาน 📊",
                            weight: "bold",
                            size: "md",
                            color: "#FF8C00"
                        },
                        {
                            type: "text",
                            text: "กดปุ่ม 'รายการงาน' หรือเข้า Dashboard ผ่านหน้าเว็บเพื่อดูสรุปงานทั้งหมดและกดเสร็จงานได้จ้า",
                            wrap: true,
                            size: "xs",
                            color: "#666666"
                        }
                    ]
                },
                {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    contents: [
                        {
                            type: "text",
                            text: "3. ระบบแจ้งเตือน ⏰",
                            weight: "bold",
                            size: "md",
                            color: "#FF8C00"
                        },
                        {
                            type: "text",
                            text: "Chicku จะคอยสะกิดเตือนเมื่อใกล้ถึงกำหนดส่ง เพื่อให้คุณไม่พลาดทุกนัดหมายสำคัญ!",
                            wrap: true,
                            size: "xs",
                            color: "#666666"
                        }
                    ]
                }
            ],
            backgroundColor: "#FFF5E6",
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
                        label: "เข้าใจแล้วจ้า! 🐥",
                        text: "เมนูหลัก"
                    },
                    style: "primary",
                    color: "#FF8C00"
                }
            ],
            backgroundColor: "#FFF5E6",
            paddingAll: "md"
        }
    };
}

module.exports = {
    taskAddedCard,
    taskListCard,
    reminderCard,
    completedCard,
    scheduleCard,
    errorCard,
    notificationSettingsCard,
    howToUseCard
};
