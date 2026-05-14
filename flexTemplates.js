function createTaskFlex(title, deadline) {
    return {
        type: "bubble",
        size: "medium",
        header: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "บันทึกงานใหม่สำเร็จ! 📝",
                    weight: "bold",
                    color: "#FFFFFF",
                    size: "md"
                }
            ],
            backgroundColor: "#4B6CB7"
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
                    margin: "md"
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
                                    text: "กำหนดส่ง:",
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
                                    flex: 5
                                }
                            ]
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
                    type: "text",
                    text: "ฉันจะแจ้งเตือนคุณเมื่อใกล้ถึงเวลาค่ะ",
                    size: "xs",
                    color: "#999999",
                    align: "center"
                }
            ]
        },
        styles: {
            header: {
                backgroundColor: "#4B6CB7"
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
                type: "text",
                text: t.title,
                weight: "bold",
                size: "sm",
                wrap: true
            },
            {
                type: "text",
                text: `📅 ${t.deadline}`,
                size: "xs",
                color: "#999999"
            },
            {
                type: "separator",
                margin: "sm"
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
                    color: "#FFFFFF"
                }
            ],
            backgroundColor: "#182848"
        },
        body: {
            type: "box",
            layout: "vertical",
            contents: taskItems.length > 0 ? taskItems : [
                {
                    type: "text",
                    text: "ไม่มีงานที่ค้างอยู่ค่ะ",
                    align: "center",
                    color: "#aaaaaa",
                    margin: "xl"
                }
            ]
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
                    type: "text",
                    text: isUrgent ? "⚠️ แจ้งเตือนด่วน!" : "🔔 แจ้งเตือนงาน",
                    weight: "bold",
                    color: "#FFFFFF"
                }
            ],
            backgroundColor: isUrgent ? "#FF4B2B" : "#F7971E"
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
                    size: "sm",
                    color: "#FF4B2B",
                    margin: "sm",
                    weight: "bold"
                },
                {
                    type: "text",
                    text: `กำหนดส่ง: ${deadline}`,
                    size: "xs",
                    color: "#999999",
                    margin: "md"
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
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "Assistant",
                            color: "#FFFFFF",
                            size: "xs",
                            weight: "bold"
                        }
                    ],
                    backgroundColor: "#11998e",
                    paddingAll: "sm",
                    cornerRadius: "md",
                    width: "70px",
                    alignItems: "center"
                },
                {
                    type: "text",
                    text: text,
                    wrap: true,
                    margin: "md",
                    size: "md",
                    color: "#333333",
                    lineSpacing: "sm"
                }
            ],
            paddingAll: "xl"
        },
        styles: {
            body: {
                backgroundColor: "#f9f9f9"
            }
        }
    };
}

module.exports = { createTaskFlex, createTaskListFlex, createNotificationFlex, createGeneralResponseFlex };
