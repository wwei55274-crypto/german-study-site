window.readingData = {
  A1: {
    description: "A1 阅读部分：先读短文，再做判断题，训练关键信息定位能力。",
    descriptionEn: "A1 reading section: read short texts first, then complete true/false tasks by locating key details.",
    items: [
      {
        id: "a1-reading-1",
        code: "A1-R1",
        type: "阅读",
        typeEn: "Reading",
        title: "阅读 1：邮件与邀请（Richtig / Falsch）",
        titleEn: "Reading 1: Email and Invitation (True/False)",
        summary: "阅读两段短文，完成 1-5 的正误判断。",
        summaryEn: "Read two short texts and complete true/false questions 1-5.",
        overview: "请先阅读 Text 1 和 Text 2，再判断每句话是 Richtig 还是 Falsch。重点抓时间词、数量词和地点信息。",
        overviewEn: "Read Text 1 and Text 2 first, then decide whether each sentence is true or false. Focus on time, quantity, and location cues.",
        focus: [
          "先看题目里的时间与地点词，再回文中定位。",
          "不要凭印象，按原文表达判断对错。",
          "Richtig/Falsch 题常见陷阱是时间和数量被改动。"
        ],
        focusEn: [
          "Locate time and place words first, then confirm in the text.",
          "Do not answer from memory; verify with exact wording.",
          "True/false traps often change time or quantity details."
        ],
        tip: "每题至少回到原文核对一次关键词，再点击答案。",
        tipEn: "For each item, go back to the source text and verify at least one keyword before answering.",
        keywords: ["邮件阅读", "Richtig/Falsch", "A1 阅读"],
        keywordsEn: ["Email reading", "True/False", "A1 Reading"],
        examples: [
          {
            de: "Text 1\n\nHallo Li,\ndanke fuer deine Mail. Dein Zug kommt hier in Hannover um 12.36 Uhr an.\nIch bin ab 12.15 Uhr im Hauptbahnhof und warte auf dich vor der Auskunft.\nDu kannst mich den ganzen Vormittag auf meinem Handy (+49 173 62 205 59) erreichen.\n\nDeine Karin",
            zh: "",
            note: ""
          },
          {
            de: "Text 2\n\nLiebe Carmen,\nam kommenden Sonntag habe ich Geburtstag.\nIch moechte gerne mit dir feiern und lade dich herzlich zu meiner Party am Samstagabend ein.\nWir fangen um 21 Uhr an. Ist das okay fuer dich?\nEs werden viele Leute da sein, die du auch kennst.\nKannst du vielleicht einen Salat mitbringen?\nUnd vergiss bitte nicht einen Pullover oder eine Jacke!\nWir wollen naemlich draussen im Garten feiern.\nIch freue mich sehr auf dich!\n\nBis zum Wochenende\nRalf",
            zh: "",
            note: ""
          }
        ],
        readingBlocks: [
          { textIndex: 0, questionStart: 0, questionEnd: 2 },
          { textIndex: 1, questionStart: 2, questionEnd: 5 }
        ],
        exercises: [
          {
            type: "choice",
            question: "1. Lis Zug kommt nach halb eins an.",
            options: ["Richtig", "Falsch"],
            answerIndex: 0,
            explanation: "Text 1 写的是 12.36 Uhr，确实在 halb eins (12:30) 之后。"
          },
          {
            type: "choice",
            question: "2. Karin wartet den ganzen Vormittag vor der Auskunft.",
            options: ["Richtig", "Falsch"],
            answerIndex: 1,
            explanation: "文中是 ab 12.15 Uhr 开始等，不是整个上午一直都在等。"
          },
          {
            type: "choice",
            question: "3. Ralf hatte am letzten Wochenende Geburtstag.",
            options: ["Richtig", "Falsch"],
            answerIndex: 1,
            explanation: "Text 2 说的是 am kommenden Sonntag（下周日）生日，不是上周末。"
          },
          {
            type: "choice",
            question: "4. Ralf hat nur zwei oder drei Leute eingeladen.",
            options: ["Richtig", "Falsch"],
            answerIndex: 1,
            explanation: "文中说 Es werden viele Leute da sein，不是只邀请两三个人。"
          },
          {
            type: "choice",
            question: "5. Die Party findet draussen statt.",
            options: ["Richtig", "Falsch"],
            answerIndex: 0,
            explanation: "Text 2 明确写了 im Garten feiern，派对在室外。"
          }
        ]
      }
    ]
  },
  A2: {
    description: "",
    descriptionEn: "",
    items: []
  }
};
