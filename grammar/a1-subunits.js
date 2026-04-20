(function () {
  window.a1SubunitData = {
    A1: {
      "verben-1": {
        "1": {
          code: "1.1",
          bookCode: "Kapitel 1",
          title: "Personalpronomen",
          titleEn: "Personal Pronouns",
          heroTitle: "Ich, du, er, sie, es, wir, ihr, sie und Sie",
          heroTitleEn: "Ich, du, er, sie, es, wir, ihr, sie and Sie",
          summary: "这一小单元先把 A1 最基础的人称代词系统搭起来，同时区分单复数、正式与非正式称呼，以及指人的代词和指物的代词。",
          summaryEn: "This first subunit builds the basic A1 pronoun system, including singular and plural, formal and informal address, and pronouns for people and things.",
          overview: "内容对应《材料_优化版》里的 Kapitel 1。网页版保留了原书的核心表格、练习顺序和语境方向，再额外做成更适合点读和练习的交互结构。",
          overviewEn: "This page follows Kapitel 1 from the optimized material. The web version keeps the core tables and exercise sequence while adding a study-friendly interactive layout.",
          tip: "先判断“代词指谁”或“代词指什么”，再去选形式，做题会稳很多。",
          tipEn: "Decide first who or what the pronoun refers to, then choose the form.",
          focus: [
            "先掌握 ich / du / er / sie / es / wir / ihr / sie / Sie 这一整套基本形式。",
            "把 du / ihr 和正式的 Sie 区分清楚，这是 A1 对话里的高频错误点。",
            "指物时，代词要跟着名词的词性走：das Messer -> es, die Gabel -> sie。",
            "句首大写的 Sie 可能是礼貌称呼，也可能是普通的 sie，只能靠语境判断。"
          ],
          focusEn: [
            "Master the full base set: ich / du / er / sie / es / wir / ihr / sie / Sie.",
            "Separate du / ihr from formal Sie, because this is a common A1 error source.",
            "When the pronoun refers to a thing, it follows the noun gender: das Messer -> es, die Gabel -> sie.",
            "Sentence-initial Sie can mean either formal address or regular sie, so context matters."
          ],
          rules: [
            {
              kind: "table",
              title: "Pronomen für Personen",
              subtitle: "Singular und Plural",
              headers: ["Person", "Singular", "Plural"],
              rows: [
                ["1. Person", "ich", "wir"],
                ["2. Person", "du", "ihr / Sie (formell)"],
                ["3. Person", "er / sie / es", "sie"]
              ],
              note: "在网页里我把原书的表格保持成学习卡片，方便先看结构再做题。"
            },
            {
              kind: "pairs",
              title: "Pronomen für Sachen",
              items: [
                { label: "das Messer", value: "es" },
                { label: "die Gabel", value: "sie" }
              ],
              note: "代词不只是指人，也会指物，所以要把名词词性和代词一起记。"
            },
            {
              kind: "callout",
              title: "Buchhinweis",
              text: "informell / formell 的区别在这一课就开始反复出现：du 用于熟人、朋友、同学；Sie 用于礼貌场景。"
            }
          ],
          bookExercises: [
            {
              id: "1",
              title: "Ergänzen Sie die Pronomen",
              lines: [
                "Das ist Herr Gupta, ________ kommt aus Indien.",
                "Das ist Frau Kioka, ________ kommt aus Japan.",
                "Herr Gupta und Frau Kioka sind in Berlin. ________ lernen Deutsch."
              ],
              answers: [
                "er",
                "sie",
                "Sie"
              ]
            },
            {
              id: "2",
              title: "Ergänzen Sie die Pronomen",
              lines: [
                "Hallo, Anna, woher kommst ________ ?",
                "Marc und Dominic, wo wohnt ________ ?",
                "Guten Tag, wie heißen ________ ?"
              ],
              answers: [
                "du",
                "ihr",
                "Sie"
              ]
            },
            {
              id: "3",
              title: "Ergänzen Sie die Pronomen",
              lines: [
                "Frau Meier geht einkaufen. ________ kauft Gemüse und Obst.",
                "Peter und Paul gehen heute nicht zur Schule. ________ haben Ferien.",
                "Frau Meier, wo arbeiten ________ ?",
                "Marie, kommst ________ heute? Nein, ________ habe keine Zeit."
              ],
              answers: [
                "Sie",
                "Sie",
                "Sie",
                "du / ich"
              ]
            },
            {
              id: "4",
              title: "In der Wohnung. Ergänzen Sie die Pronomen",
              lines: [
                "Der Schrank ist teuer. ________ kommt aus Italien.",
                "Das Regal ist praktisch. ________ kostet nur 49 Euro.",
                "Die Lampe ist neu. ________ ist modern.",
                "Das sind vier Stühle. ________ kosten nur 100 Euro.",
                "Die Sessel sind sehr bequem und ________ sind günstig.",
                "Der Tisch da ist schön, aber ________ ist klein."
              ],
              answers: [
                "Er",
                "Es",
                "Sie",
                "Sie",
                "sie",
                "er"
              ]
            },
            {
              id: "5",
              title: "In der Stadt. Ergänzen Sie die Pronomen",
              lines: [
                "Mario: ________ kommt später. Und wann kommt Phillip?",
                "Elena: ________ kommt heute nicht. ________ hat keine Lust.",
                "Mario: Dann gehen ________ alleine ins Café und trinken einen Kaffee.",
                "Kellner: Guten Tag, was möchten ________ ?",
                "Elena und Mario: ________ möchten zwei Kaffee.",
                "Kellner: Möchten Sie auch Kuchen? ________ ist sehr gut.",
                "Elena: Nein, danke. ________ möchte keinen Kuchen. Möchtest ________ Kuchen, Mario?",
                "Mario: Nein, ________ nehme auch nur einen Kaffee."
              ],
              answers: [
                "Sie",
                "Er",
                "Er",
                "wir",
                "Wir",
                "Er",
                "Ich / du",
                "ich"
              ]
            },
            {
              id: "6",
              title: "Formell oder informell? Sie oder du? Sie oder ihr?",
              lines: [
                "Anna, was machst ________ ?",
                "Frau Schmidt, was machen ________ ?",
                "Daniel und Anna, was macht ________ ?",
                "Herr Meyer und Frau Schmidt, was machen ________ ?"
              ],
              answers: [
                "du",
                "Sie",
                "ihr",
                "Sie"
              ]
            }
          ],
          referenceChecks: {
            id: "7",
            title: "Was bedeutet sie und Sie? Schreiben Sie die Person oder Sache.",
            passage: [
              "Herr Lindner: Kommen Sie bitte herein. Das ist meine Frau, Karina. Frau Peneva.",
              "Und das sind unsere Kinder. Das ist Anne, sie ist zwei Monate alt und das ist Lukas, er ist drei.",
              "Frau Peneva: Oh, sie sind süß!",
              "Herr Lindner: Und Karina, das ist Olga Peneva, sie ist eine Kollegin von mir. Sie kommt aus Bulgarien.",
              "Frau Lindner: Guten Tag Frau Peneva! Oh danke, ich mag Blumen sehr gerne. Sie sind wunderschön. Setzen Sie sich doch bitte, möchten Sie etwas trinken?"
            ],
            checks: [
              { prompt: "Sie in „Kommen Sie bitte herein“", answer: "Frau Peneva" },
              { prompt: "sie in „sie ist zwei Monate alt“", answer: "Anne" },
              { prompt: "sie in „sie sind süß“", answer: "die Kinder" },
              { prompt: "sie in „sie ist eine Kollegin von mir“", answer: "Olga Peneva" },
              { prompt: "Sie in „Sie kommt aus Bulgarien“", answer: "Olga Peneva" },
              { prompt: "Sie in „Sie sind wunderschön“", answer: "die Blumen" },
              { prompt: "Sie in „Setzen Sie sich doch bitte“", answer: "Frau Peneva" },
              { prompt: "Sie in „möchten Sie etwas trinken?“", answer: "Frau Peneva" }
            ]
          },
          answerSheet: [
            "1: er / sie / Sie",
            "2: du / ihr / Sie",
            "3: Sie / Sie / Sie / du / ich",
            "4: Er / Es / Sie / Sie / sie / er",
            "5: Sie / Er / Er / wir / Wir / Er / Ich / du / ich",
            "6: du / Sie / ihr / Sie",
            "7: Frau Peneva / Anne / die Kinder / Olga Peneva / Olga Peneva / die Blumen / Frau Peneva / Frau Peneva"
          ],
          answerSheetNote: "答案区根据材料中的 Kapitel 1 内容整理成逐题可读版本，便于网页里直接核对。",
          quickExercises: []
        },
        "2": {
          code: "1.2",
          bookCode: "Kapitel 2",
          title: "Konjugation Präsens",
          titleEn: "Present-Tense Conjugation",
          heroTitle: "Ich komme, du kommst",
          heroTitleEn: "Ich komme, du kommst",
          summary: "这一小单元进入现在时动词变位本身，重点是规则词尾，以及词干以 t/d、ß/z 结尾时的常见变位形式。",
          summaryEn: "This subunit moves into present-tense conjugation itself, focusing on regular endings and common patterns for stems ending in t/d and ß/z.",
          overview: "内容对应《材料_优化版》里的 Kapitel 2《Ich komme, du kommst》。网页版保留了书里的变位表、原书练习和 Lösungen 顺序，再把长段落练习拆成更适合网页逐句核对的结构。",
          overviewEn: "This page follows Kapitel 2, 'Ich komme, du kommst'. The web version keeps the book table, the original exercises, and the solution order, while splitting long paragraphs into line-by-line practice for easier checking.",
          tip: "先看主语，再看词尾。A1 现在时最稳的做法不是背整句，而是先把 ich / du / er-sie-es / wir / ihr / sie-Sie 对应的词尾感建立起来。",
          tipEn: "Look at the subject first, then choose the ending. At A1, the most reliable method is to build a feel for the endings of ich / du / er-sie-es / wir / ihr / sie-Sie.",
          focus: [
            "规则动词最基础的词尾是 ich -e、du -st、er/sie/es -t、wir -en、ihr -t、sie/Sie -en。",
            "词干以 t / d 结尾时，du 和 ihr 常常会多出一个辅助元音：du arbeitest, ihr arbeitet。",
            "词干以 ß / z 结尾时，du 形式通常只保留 -t：du heißt, du tanzt。",
            "做题时先判断主语是谁，再去补词尾，比直接背答案更稳。"
          ],
          focusEn: [
            "The basic regular endings are ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.",
            "With stems ending in t / d, du and ihr often add a helping vowel: du arbeitest, ihr arbeitet.",
            "With stems ending in ß / z, the du form usually keeps only -t: du heißt, du tanzt.",
            "In practice, identify the subject first and then supply the ending."
          ],
          rules: [
            {
              kind: "table",
              title: "Konjugation Präsens",
              subtitle: "normale Verben · Verben mit t,d am Ende · Verben mit ß,z am Ende",
              headers: ["Person", "kommen", "arbeiten", "heißen"],
              rows: [
                ["ich", "komme", "arbeite", "heiße"],
                ["du", "kommst", "arbeitest", "heißt"],
                ["er, sie, es", "kommt", "arbeitet", "heißt"],
                ["wir", "kommen", "arbeiten", "heißen"],
                ["ihr", "kommt", "arbeitet", "heißt"],
                ["sie, Sie", "kommen", "arbeiten", "heißen"]
              ],
              note: "auch: antworten, reden... / auch: tanzen..."
            },
            {
              kind: "callout",
              title: "Endungen im Blick",
              text: "Ich komm-e. / Komm-st du? / Sie kommen."
            }
          ],
          bookExercises: [
            {
              id: "1",
              title: "KLEINE DIALOGE. Ergänzen Sie die Endungen.",
              lines: [
                "Marc: Woher komm____ du?",
                "Alice: Ich komm____ aus Brasilien.",
                "Das ist mein Freund, er komm____ aus Russland.",
                "Marc: Und wo wohn____ ihr?",
                "Alice und Yuri: Wir wohn____ ganz in der Nähe.",
                "Wo arbeit____ du?",
                "Marc: Ich arbeit____ bei der Post."
              ],
              answers: [
                "st",
                "e",
                "t",
                "t",
                "en",
                "est",
                "e"
              ]
            },
            {
              id: "2",
              title: "Was passt zusammen? Kombinieren Sie.",
              options: [
                "C heißt Schmidt.",
                "F komme aus China.",
                "B kommen aus Italien.",
                "G wohnen in Berlin."
              ],
              lines: [
                "Er",
                "Ich",
                "Wir",
                "Sie"
              ],
              answers: [
                "C",
                "F",
                "B",
                "G"
              ]
            },
            {
              id: "3",
              title: "Ergänzen Sie die Endungen. Kombinieren Sie.",
              lines: [
                "Wie heiß____ du? 1.",
                "Komm____ ihr mit ins Kino? 2.",
                "Frau Tan komm____ heute. Geh____ Sie 3 zum Flughafen?",
                "Warum antwort____ du nicht? 4.",
                "Tanz____ du gerne? 5.",
                "A Ja, aber mein Freund tanz____ leider nicht.",
                "B Ich heiß____ Alexander.",
                "C Ich versteh____ dich nicht.",
                "D Nein, leider nicht. Ich arbeit____ heute bis acht und Jana besuch____ ihre Eltern.",
                "E Ja, sie komm____ um 19 Uhr, dann bring____ ich sie zum Hotel."
              ],
              answers: [
                "t",
                "t",
                "t / en",
                "est",
                "t",
                "t",
                "e",
                "e",
                "e / t",
                "t / e"
              ]
            },
            {
              id: "4",
              title: "IM DEUTSCHKURS. Ergänzen Sie die Endungen.",
              lines: [
                "Maria komm____ aus Spanien.",
                "Pedro und Angelo komm____ aus Südamerika.",
                "Maria, Pedro und Angelo lern____ zusammen Deutsch.",
                "Pedro schreib____ gerne.",
                "Maria hör____ gerne Dialoge und Angelo lern____ gerne Grammatik.",
                "Sie mach____ zusammen Hausaufgaben und dann geh____ sie in den Club.",
                "Maria tanz____ und Angelo und Pedro red____ und trink____ eine Cola.",
                "Sie tanz____ leider nicht gerne."
              ],
              answers: [
                "t",
                "en",
                "en",
                "t",
                "t / t",
                "en / en",
                "t / en / en",
                "en"
              ]
            },
            {
              id: "5",
              title: "EINE E-MAIL. Ergänzen Sie die Endungen.",
              lines: [
                "Ich komm____ gerne.",
                "Woher kenn____ du ihn?",
                "Woher komm____ er?",
                "Arbeit____ er schon oder studier____ er noch?",
                "Stefan ist auch in meinem Kurs und lern____ Deutsch.",
                "Ich kenn____ ihn jetzt seit vier Wochen und wir mach____ fast alles zusammen.",
                "Wir tanz____ gerne und geh____ gerne in den Club.",
                "Ihr tanz____ doch auch gerne, ich kenn____ dich doch.",
                "Ich freu____ mich schon."
              ],
              answers: [
                "e",
                "st",
                "t",
                "et / t",
                "t",
                "e / en",
                "en / en",
                "t / e",
                "e"
              ]
            },
            {
              id: "6",
              title: "MEIN ARBEITSTAG. Ergänzen Sie die Endungen.",
              lines: [
                "Ich komm____ meistens gegen acht Uhr ins Büro und schalt____ erst einmal den Computer ein.",
                "Ich öffn____ meine Mailbox und beantwort____ meine E-Mails.",
                "Herr Richter, mein Kollege, komm____ eine halbe Stunde später.",
                "Er bring____ erst seine Kinder in den Kindergarten.",
                "Wir red____ ein bisschen, telefonier____ mit Kundinnen und Kunden und schreib____ E-Mails.",
                "Mittags geh____ wir zusammen mit ein paar Kolleginnen und Kollegen aus einer anderen Abteilung essen.",
                "Meistens trink____ wir auch noch einen Kaffee zusammen.",
                "Das mach____ immer Spaß, weil die Kolleginnen und Kollegen lustige Geschichten von ihrer Arbeit erzähl____.",
                "Manchmal frag____ ich sie: Arbeit____ ihr eigentlich auch?"
              ],
              answers: [
                "e / e",
                "e / e",
                "t",
                "t",
                "en / e / e",
                "en",
                "en",
                "t / en",
                "e / et"
              ]
            }
          ],
          answerSheet: [
            "1: kommst / komme / kommt / wohnt / wohnen / arbeitest / arbeite",
            "2: C / F / B / G",
            "3: heißt / Kommst / kommt / Gehen / antwortest / Tanzt / tanzt / heiße / verstehe / arbeite / besucht / kommt / bringe",
            "4: kommt / kommen / lernen / schreibt / hört / lernt / machen / gehen / tanzt / reden / trinken / tanzen",
            "5: komme / kennst / kommt / Arbeitet / studiert / lernt / kenne / machen / tanzen / gehen / tanzt / kenne / freue",
            "6: komme / schalte / öffne / beantworte / kommt / bringt / reden / telefoniere / schreibe / gehen / trinken / machen / erzählen / frage / Arbeitet"
          ],
          answerSheetNote: "答案按书本 Lösungen 中 Kapitel 2 的顺序整理。网页练习里为了更适合逐题填写，把长段落拆成了多行，但答案顺序仍然保持和原书一致。",
          quickExercises: []
        },
        "3": {
          code: "1.3",
          bookCode: "Kapitel 3",
          title: "Sein, haben, moechten und besondere Verben",
          titleEn: "Sein, haben, moechten and Special Verbs",
          heroTitle: "Ich bin, du hast, er moechte",
          heroTitleEn: "Ich bin, du hast, er moechte",
          summary: "这一小单元接入 Kapitel 3，围绕 sein / haben / moechten / moegen / wissen / tun 做集中训练。",
          summaryEn: "This subunit covers Kapitel 3 with focused practice on sein / haben / moechten / moegen / wissen / tun.",
          overview: "先掌握 6 个常用不规则动词的变位，再做填空和组合题。题目内容来自你提供的 1.3 文档。",
          overviewEn: "Master six high-frequency irregular verbs first, then complete fill-in and combination exercises from your 1.3 document.",
          tip: "建议先做表格题（2-3），再做长对话题（6-10）。",
          tipEn: "Start with table drills (2-3), then move to longer dialogue exercises (6-10).",
          focus: [
            "sein / haben 是 A1 高频核心。",
            "moechten / moegen 要区分语气和搭配。",
            "wissen / tun 常见于问答句。"
          ],
          focusEn: [
            "sein / haben are core high-frequency verbs at A1.",
            "Distinguish moechten / moegen by tone and usage.",
            "wissen / tun are common in question-answer patterns."
          ],
          rules: [
            {
              kind: "table",
              title: "核心动词变位总览",
              subtitle: "sein / haben / moechten / moegen / wissen / tun",
              headers: ["Pronomen", "sein", "haben", "moechten", "moegen", "wissen", "tun"],
              rows: [
                ["ich", "bin", "habe", "moechte", "mag", "weiss", "tue"],
                ["du", "bist", "hast", "moechtest", "magst", "weisst", "tust"],
                ["er/sie/es", "ist", "hat", "moechte", "mag", "weiss", "tut"],
                ["wir", "sind", "haben", "moechten", "moegen", "wissen", "tun"],
                ["ihr", "seid", "habt", "moechtet", "moegt", "wisst", "tut"],
                ["sie/Sie", "sind", "haben", "moechten", "moegen", "wissen", "tun"]
              ],
              note: "先背主语+动词，再放进句子里。"
            }
          ],
          bookExercises: [
            {
              id: "1",
              title: "Ergaenzen Sie.",
              lines: [
                "Sie ____ aus Italien.",
                "Sie ____ Urlaub machen.",
                "Aber sie ____, sie ____ kein Geld.",
                "Was ____ sie jetzt?",
                "Sie ____ verheiratet.",
                "Sie ____ fuenf Kinder."
              ],
              answers: [
                "kommen",
                "moechten",
                "koennen nicht / haben",
                "tun",
                "sind",
                "haben"
              ]
            },
            {
              id: "2",
              title: "Ergaenzen Sie die Tabellen: sein / haben",
              lines: [
                "ich ____ / ____",
                "du ____ / ____",
                "er, sie, es ____ / ____",
                "wir ____ / ____",
                "ihr ____ / ____",
                "sie, Sie ____ / ____"
              ],
              answers: [
                "bin / habe",
                "bist / hast",
                "ist / hat",
                "sind / haben",
                "seid / habt",
                "sind / haben"
              ]
            },
            {
              id: "3",
              title: "Ergaenzen Sie die Tabellen: moechten / moegen / wissen / tun",
              lines: [
                "ich ____ / ____ / ____ / ____",
                "du ____ / ____ / ____ / ____",
                "er, sie, es ____ / ____ / ____ / ____",
                "wir ____ / ____ / ____ / ____",
                "ihr ____ / ____ / ____ / ____",
                "sie, Sie ____ / ____ / ____ / ____"
              ],
              answers: [
                "moechte / mag / weiss / tue",
                "moechtest / magst / weisst / tust",
                "moechte / mag / weiss / tut",
                "moechten / moegen / wissen / tun",
                "moechtet / moegt / wisst / tut",
                "moechten / moegen / wissen / tun"
              ]
            },
            {
              id: "4",
              title: "Das Verb sein. Ergaenzen Sie.",
              lines: [
                "Guten Tag, wie ____ Ihr Name?",
                "Mein Name ____ Misterek.",
                "____ Sie neu hier?",
                "Nein, ich ____ schon ein Jahr in Hamburg.",
                "____ Sie Studentin?"
              ],
              answers: [
                "ist",
                "ist",
                "Sind",
                "bin",
                "Sind"
              ]
            },
            {
              id: "5",
              title: "Kombinieren Sie und schreiben Sie Saetze.",
              options: [
                "Ich · Du · Er · Sie · Wir · Ihr · Frau Tannberg · Mein Name · Das",
                "bin · bist · ist · sind · seid",
                "15 Jahre alt. · in Muenchen. · Herr Wang. · Kolakowski. · ein Woerterbuch. · Lehrer. · gluecklich. · im Buero. · aus Japan."
              ],
              lines: [
                "1 ____",
                "2 ____",
                "3 ____",
                "4 ____",
                "5 ____",
                "6 ____",
                "7 ____",
                "8 ____",
                "9 ____"
              ],
              answers: [
                "Ich bin gluecklich.",
                "Du bist 15 Jahre alt.",
                "Er ist Herr Wang.",
                "Sie ist aus Japan.",
                "Wir sind in Muenchen.",
                "Ihr seid Lehrer.",
                "Frau Tannberg ist im Buero.",
                "Mein Name ist Kolakowski.",
                "Das ist ein Woerterbuch."
              ]
            },
            {
              id: "6",
              title: "Das Verb haben. Ergaenzen Sie.",
              lines: [
                "____ du Geld? - Nein, aber ich ____ Zeit.",
                "Du ____ Glueck, ich ____ kein Geld und keine Zeit.",
                "____ ihr schon eine Wohnung hier in Mainz?",
                "____ noch keine Wohnung, wir wohnen im Hotel.",
                "Herr Kim ____ viel Arbeit, er ____ auch am Wochenende keine Freizeit."
              ],
              answers: [
                "Hast / habe",
                "hast / habe",
                "Habt",
                "Wir haben",
                "hat / hat"
              ]
            },
            {
              id: "7",
              title: "sein oder haben? Ergaenzen Sie.",
              lines: [
                "Das ____ Angelo und Pascal. Sie ____ Schueler. Sie ____ einen Hund. Er heisst Snoopy und er ____ fuenf Monate alt.",
                "Was ____ Sie von Beruf? - Ich ____ Lehrer.",
                "____ Sie verheiratet? - Ja, ich ____ verheiratet und ich ____ vier Kinder.",
                "____ Sie ein Auto? - Ja, natuerlich. ____ wir ein Auto.",
                "____ du ein Handy? - Ja, meine Nummer ____ 0162/2090503.",
                "Das ____ Mikunda. Sie ____ meine Katze. Sie ____ 3 Jahre alt und ____ ganz graue Haare. Jetzt ____ sie Mutter. Sie ____ zwei Katzenbabys. Sie ____ suess und ____ graue Haare wie die Mutter. Mikunda ____ sehr gluecklich und ich ____ auch gluecklich."
              ],
              answers: [
                "sind / sind / haben / ist",
                "sind / bin",
                "Sind / bin / habe",
                "Haben / Haben",
                "Hast / ist",
                "ist / ist / ist / hat / ist / hat / ist / hat / ist / bin"
              ]
            },
            {
              id: "8",
              title: "Das Verb moechten. Ergaenzen Sie.",
              lines: [
                "Guten Tag, was ____ Sie?",
                "Wir ____ etwas trinken.",
                "Ich ____ einen Kaffee.",
                "Und was ____ du?",
                "Ich ____ eine Cola.",
                "Frau Taylor und ihr Sohn Ben ____ etwas trinken. Frau Taylor ____ einen Kaffee und Ben ____ eine Cola."
              ],
              answers: [
                "moechten",
                "moechten",
                "moechte",
                "moechtest",
                "moechte",
                "moechten / moechte / moechte"
              ]
            },
            {
              id: "9",
              title: "Das Verb wissen. Ergaenzen Sie.",
              lines: [
                "____ Sie, wo der Bahnhof ist?",
                "Tut mir leid, das ____ ich nicht. Fragen Sie doch den Polizisten, der ____ es bestimmt.",
                "Niemand ____, ob Herr Sorodin heute kommt.",
                "____ du, warum Anne heute so spaet kommt?",
                "Die Kinder ____ heute viel mehr als wir frueher."
              ],
              answers: [
                "Wissen",
                "weiss / weiss",
                "weiss",
                "Weisst",
                "wissen"
              ]
            },
            {
              id: "10",
              title: "Das Verb tun. Ergaenzen Sie die Endungen.",
              lines: [
                "Was tu____ denn weh?",
                "Meine Ohren tu____ weh. Was kann ich tu____?",
                "Arbeiten Sie nicht, raeumen Sie nicht auf, tu____ Sie ganz wenig.",
                "Was tu____ du? - Frag nicht, was ich tu____. Ich will einfach mal nichts tu____."
              ],
              answers: [
                "t",
                "n / n",
                "n",
                "st / e / n"
              ]
            }
          ],
          answerSheet: [
            "1: kommen / moechten / koennen nicht + haben / tun / sind / haben",
            "2: bin-habe / bist-hast / ist-hat / sind-haben / seid-habt / sind-haben",
            "3: moechte-mag-weiss-tue / moechtest-magst-weisst-tust / moechte-mag-weiss-tut / moechten-moegen-wissen-tun / moechtet-moegt-wisst-tut / moechten-moegen-wissen-tun",
            "4: ist / ist / Sind / bin / Sind",
            "5: Ich bin gluecklich. / Du bist 15 Jahre alt. / Er ist Herr Wang. / Sie ist aus Japan. / Wir sind in Muenchen. / Ihr seid Lehrer. / Frau Tannberg ist im Buero. / Mein Name ist Kolakowski. / Das ist ein Woerterbuch.",
            "6: Hast-habe / hast-habe / Habt / Wir haben / hat-hat",
            "7: sind-sind-haben-ist / sind-bin / Sind-bin-habe / Haben-Haben / Hast-ist / ist-ist-ist-hat-ist-hat-ist-hat-ist-bin",
            "8: moechten / moechten / moechte / moechtest / moechte / moechten-moechte-moechte",
            "9: Wissen / weiss-weiss / weiss / Weisst / wissen",
            "10: t / n-n / n / st-e-n"
          ],
          answerSheetNote: "1.3 题目已从你提供的文档接入。若原书版本和你的课本存在细微差异，可在本地编辑模式直接微调题干与答案。",
          quickExercises: []
        },
        "4": {
          code: "1.4",
          bookCode: "Kapitel 4",
          title: "Verben mit Vokalwechsel",
          titleEn: "Verbs with Vowel Change",
          heroTitle: "Ich esse wenig, aber du isst viel!",
          heroTitleEn: "Ich esse wenig, aber du isst viel!",
          summary: "这一小单元对应 Kapitel 4，集中训练元音变化动词。",
          summaryEn: "This subunit follows Kapitel 4 with focused training on vowel-changing verbs.",
          overview: "内容来自你提供的 1.4 文档，覆盖表格填空、规则判断、原形还原、语境填空和长段落综合练习。",
          overviewEn: "Built from your 1.4 document: table completion, rule checks, infinitives, contextual fills, and longer integrated drills.",
          tip: "先做第 1-3 题建立变化感觉，再做 4-7 题会更稳。",
          tipEn: "Build the pattern with exercises 1-3 first, then move to 4-7 for context practice.",
          focus: [
            "元音变化主要出现在 du 和 er/sie/es 形式。",
            "不是所有含 e 或 a 的动词都会变元音。",
            "先记高频动词：essen, lesen, sehen, sprechen, nehmen, geben, fahren, laufen。"
          ],
          focusEn: [
            "Vowel change mainly appears in du and er/sie/es forms.",
            "Not every verb with e or a changes its vowel.",
            "Start with high-frequency verbs: essen, lesen, sehen, sprechen, nehmen, geben, fahren, laufen."
          ],
          rules: [
            {
              kind: "table",
              title: "Vokalwechsel im Praesens",
              subtitle: "essen und schlafen",
              headers: ["Pronomen", "essen", "schlafen"],
              rows: [
                ["ich", "esse", "schlafe"],
                ["du", "isst", "schlaefst"],
                ["er/sie/es", "isst", "schlaeft"],
                ["wir", "essen", "schlafen"],
                ["ihr", "esst", "schlaft"],
                ["sie/Sie", "essen", "schlafen"]
              ],
              note: "Meistens wechselt der Vokal nur bei du und er/sie/es."
            }
          ],
          bookExercises: [
            {
              id: "1",
              title: "Ergaenzen Sie die Tabelle.",
              lines: [
                "ich ____ / ____ (essen / schlafen)",
                "du ____ / ____ (essen / schlafen)",
                "er, sie, es ____ / ____ (essen / schlafen)",
                "wir ____ / ____ (essen / schlafen)",
                "ihr ____ / ____ (essen / schlafen)",
                "sie, Sie ____ / ____ (essen / schlafen)"
              ],
              answers: [
                "esse / schlafe",
                "isst / schlaefst",
                "isst / schlaeft",
                "essen / schlafen",
                "esst / schlaft",
                "essen / schlafen"
              ]
            },
            {
              id: "2",
              title: "Regel und Gruppen. Ergaenzen Sie.",
              options: [
                "Wortbank: empfehlen, essen, geben, fernsehen, helfen, lesen, mitnehmen, nehmen, sehen, sprechen, vergessen, werden, abfahren, anfangen, einladen, einschlafen, fahren, gefallen, laufen, schlafen, tragen, waschen"
              ],
              lines: [
                "Bei Verben mit Vokalwechsel wechselt bei ____ und ____, ____ und ____ der Vokal.",
                "Nicht bei allen Verben mit ____ oder ____ wechselt der Vokal.",
                "Gruppe 1 (e-i/e-ie): ____",
                "Gruppe 2 (a-ae): ____"
              ],
              answers: [
                "du / er / sie / es",
                "e / a",
                "empfehlen, essen, geben, helfen, lesen, nehmen, sehen, sprechen, vergessen, werden",
                "abfahren, anfangen, einladen, einschlafen, fahren, gefallen, laufen, schlafen, tragen, waschen"
              ]
            },
            {
              id: "3",
              title: "Wie heisst der Infinitiv? Schreiben Sie.",
              lines: [
                "du gibst -> ____",
                "er laeuft -> ____",
                "sie hilft -> ____",
                "du nimmst -> ____",
                "er waescht -> ____",
                "du siehst -> ____",
                "er spricht -> ____",
                "sie vergisst -> ____",
                "er empfiehlt -> ____",
                "wir lesen -> ____",
                "er isst -> ____",
                "du faehrst -> ____"
              ],
              answers: [
                "geben",
                "laufen",
                "helfen",
                "nehmen",
                "waschen",
                "sehen",
                "sprechen",
                "vergessen",
                "empfehlen",
                "lesen",
                "essen",
                "fahren"
              ]
            },
            {
              id: "4",
              title: "Ergaenzen Sie die Verben.",
              lines: [
                "(essen) ____ ihr abends immer zusammen?",
                "(essen) Ja, wir ____ zusammen, aber heute nicht. Dimitri ____ mit einer Kundin und die Kinder ____ bei Freunden.",
                "(essen) Und du? ____ du abends mit Finn zusammen?",
                "(essen) Finn ____ abends nichts und ich ____ mir eine Kleinigkeit.",
                "(lesen) ____ ihr gerne?",
                "(lesen) Ich ____ gern Romane und Petro ____ gar nicht.",
                "(lesen) Das stimmt nicht. Ich ____ auch!",
                "(lesen) Was ____ du denn? Nur Nachrichten im Internet.",
                "(nehmen) Bitte, was ____ Sie?",
                "(nehmen) Ich ____ Haehnchen mit Reis. Iliana und Petro, was ____ ihr?",
                "(nehmen) Wir ____ ein Schnitzel.",
                "(nehmen) Nein, du ____ ein Schnitzel, aber ich ____ Spaghetti!",
                "(schlafen) Wie lange ____ Sie in der Nacht meistens?",
                "(schlafen) Wir ____ meistens ungefaehr acht Stunden.",
                "(schlafen) Ja, du ____ immer acht Stunden. Ich ____ nur sechs Stunden.",
                "(fahren) Wie kommen Sie zur Arbeit? ____ Sie mit der U-Bahn?",
                "(fahren) Nein, ich ____ mit dem Auto.",
                "(fahren) Und ihr, Kinder, wie ____ ihr?",
                "(fahren) Ich ____ meistens mit dem Fahrrad. Aber Iliana ____ immer mit dem Bus."
              ],
              answers: [
                "esst",
                "essen / isst / essen",
                "isst",
                "isst / esse",
                "lest",
                "lese / liest",
                "lese",
                "liest",
                "nehmen",
                "nehme / nehmt",
                "nehmen",
                "nimmst / nehme",
                "schlafen",
                "schlafen",
                "schlaefst / schlafe",
                "Fahren",
                "fahre",
                "fahrt",
                "fahre / faehrt"
              ]
            },
            {
              id: "5",
              title: "LARAS TAG. Ergaenzen Sie die Verben.",
              lines: [
                "Um 7 Uhr ____ (essen) sie mit ihrer Familie Fruehstueck und ____ (lesen) die Zeitung.",
                "Ihr Mann Dimitri und sie ____ (fahren) mit dem Auto in die Stadt.",
                "Da kaufen sie zusammen ein und Dimitri ____ (tragen) alles ins Auto.",
                "Lara ____ (laufen) noch ein bisschen durch die Stadt und Dimitri ____ (fahren) zur Arbeit.",
                "Um 11 Uhr ____ (nehmen) Lara den Bus zurueck nach Hause.",
                "Zu Hause ____ (waschen) sie Waesche und ____ (helfen) ihrer Mutter.",
                "Am Nachmittag ____ (geben) Lara Deutschunterricht.",
                "Sie ____ (sprechen) nur Deutsch mit den Schuelerinnen und Schuelern.",
                "Die Schuelerinnen und Schueler ____ (lesen) Texte und ____ (sehen) manchmal einen Film.",
                "Lara ____ (sehen) auch gerne Filme."
              ],
              answers: [
                "isst / liest",
                "fahren",
                "traegt",
                "laeuft / faehrt",
                "nimmt",
                "waescht / hilft",
                "gibt",
                "spricht",
                "lesen / sehen",
                "sieht"
              ]
            },
            {
              id: "6",
              title: "Vokalwechsel oder nicht? Ergaenzen Sie die er-Form.",
              lines: [
                "leben -> er ____",
                "kaufen -> er ____",
                "machen -> er ____",
                "lesen -> er ____",
                "gehen -> er ____",
                "waschen -> er ____",
                "laufen -> er ____",
                "geben -> er ____",
                "verstehen -> er ____"
              ],
              answers: [
                "lebt",
                "kauft",
                "macht",
                "liest",
                "geht",
                "waescht",
                "laeuft",
                "gibt",
                "versteht"
              ]
            },
            {
              id: "7",
              title: "EINE EINLADUNG. Ergaenzen Sie die Verben.",
              options: [
                "gefallen · mitnehmen · einladen · ankommen · laufen · ansehen · zurueckfahren · schlafen"
              ],
              lines: [
                "Du ____ erst am Sonntag ____ und ____ eine Nacht bei uns.",
                "Du ____ am besten bequeme Schuhe ____, dann koennen wir am Sonntag zusammen durch die Stadt ____ und alles ____.",
                "Das ____ dir doch, oder?",
                "Wann ____ du in Pirgos ____?"
              ],
              answers: [
                "kommst / an / schlaefst",
                "nimmst / mit / laufen / ansehen",
                "gefaellt",
                "faehrst / zurueck"
              ]
            }
          ],
          answerSheet: [
            "1: esse-schlafe / isst-schlaefst / isst-schlaeft / essen-schlafen / esst-schlaft / essen-schlafen",
            "2: du-er-sie-es / e-a / Gruppe1(e-i/e-ie) / Gruppe2(a-ae)",
            "3: geben / laufen / helfen / nehmen / waschen / sehen / sprechen / vergessen / empfehlen / lesen / essen / fahren",
            "4: esst / essen-isst-essen / isst / isst-esse / lest / lese-liest / lese / liest / nehmen / nehme-nehmt / nehmen / nimmst-nehme / schlafen / schlafen / schlaefst-schlafe / Fahren / fahre / fahrt / fahre-faehrt",
            "5: isst-liest / fahren / traegt / laeuft-faehrt / nimmt / waescht-hilft / gibt / spricht / lesen-sehen / sieht",
            "6: lebt / kauft / macht / liest / geht / waescht / laeuft / gibt / versteht",
            "7: kommst-an-schlaefst / nimmst-mit-laufen-ansehen / gefaellt / faehrst-zurueck"
          ],
          answerSheetNote: "1.4 题目已按你提供的文档接入。若你课本版本有细节差异，可在本地编辑模式继续微调题干与答案。",
          quickExercises: []
        },
        "5-7": {
          code: "5-7",
          bookCode: "Kapitel 5-7",
          title: "Modalverben（1.5-1.7）",
          titleEn: "Modal Verbs (1.5-1.7)",
          heroTitle: "Modalverben：Konjugation + Gebrauch",
          heroTitleEn: "Modal Verbs: Conjugation + Usage",
          summary: "1.5 到 1.7 的情态动词内容合并在同一个小节里，按原书顺序连续练习。",
          summaryEn: "The modal-verb content from 1.5 to 1.7 is merged into one subunit in original book order.",
          overview: "这一节整合 koennen / muessen / duerfen / wollen / sollen / moechten 的变位、句子位置与语义区别，保持连续训练。",
          overviewEn: "This section combines conjugation, sentence position, and usage differences of koennen / muessen / duerfen / wollen / sollen / moechten.",
          tip: "先判断语义（必须/建议/允许/意愿），再选动词形式，最后检查不定式是否在句末。",
          tipEn: "Decide meaning first (must/should/may/want), then choose form, then verify infinitive position.",
          focus: [
            "Modalverb is in Position 2.",
            "Main infinitive stays at the end.",
            "Forms change by subject."
          ],
          focusEn: [
            "Modalverb is in Position 2.",
            "Main infinitive stays at the end.",
            "Forms change by subject."
          ],
          rules: [
            {
              kind: "table",
              title: "Modalverben (Praesens)",
              subtitle: "koennen, muessen, duerfen, wollen, sollen, moechten",
              headers: ["Pronomen", "koennen", "muessen", "duerfen", "wollen", "sollen", "moechten"],
              rows: [
                ["ich", "kann", "muss", "darf", "will", "soll", "moechte"],
                ["du", "kannst", "musst", "darfst", "willst", "sollst", "moechtest"],
                ["er/sie/es/man", "kann", "muss", "darf", "will", "soll", "moechte"],
                ["wir", "koennen", "muessen", "duerfen", "wollen", "sollen", "moechten"],
                ["ihr", "koennt", "muesst", "duerft", "wollt", "sollt", "moechtet"],
                ["sie/Sie", "koennen", "muessen", "duerfen", "wollen", "sollen", "moechten"]
              ],
              note: "Sentence pattern: Subjekt + Modalverb + ... + Infinitiv."
            }
          ],
          bookExercises: [
            {
              id: "1",
              title: "Ergaenzen Sie.",
              lines: [
                "ich ____ / ____ / ____ / ____ / ____ / ____",
                "du ____ / ____ / ____ / ____ / ____ / ____",
                "er, sie, es, man ____ / ____ / ____ / ____ / ____ / ____",
                "wir ____ / ____ / ____ / ____ / ____ / ____",
                "ihr ____ / ____ / ____ / ____ / ____ / ____",
                "sie, Sie ____ / ____ / ____ / ____ / ____ / ____"
              ],
              answers: [
                "kann / muss / darf / will / soll / moechte",
                "kannst / musst / darfst / willst / sollst / moechtest",
                "kann / muss / darf / will / soll / moechte",
                "koennen / muessen / duerfen / wollen / sollen / moechten",
                "koennt / muesst / duerft / wollt / sollt / moechtet",
                "koennen / muessen / duerfen / wollen / sollen / moechten"
              ]
            },
            {
              id: "2",
              title: "Position 2 oder Ende? Ergaenzen Sie.",
              lines: [
                "Am Sonntag ____ wir lange schlafen.",
                "Ich ____ nicht arbeiten.",
                "Die Kinder ____ am Vormittag spielen.",
                "Meine Tochter ____ viel Eis essen.",
                "Mein Sohn ____ Hausaufgaben machen.",
                "Er ____ aber ins Schwimmbad gehen."
              ],
              answers: [
                "koennen",
                "muss",
                "wollen",
                "moechte",
                "muss",
                "will"
              ]
            },
            {
              id: "3",
              title: "Ergaenzen Sie die Verben.",
              lines: [
                "(moechten) Was ____ du essen, Annika?",
                "(moechten) Ich ____ Spaghetti und Juliane ____ Pizza.",
                "(moechten) Ich ____ nicht zwei Essen kochen.",
                "(moechten) Also, was ____ ihr? / Wir ____ Eis! / Die Kinder ____ Eis!",
                "(koennen) Ich ____ viel besser schwimmen als du!",
                "(koennen) Du ____ vielleicht besser schwimmen, aber ich ____ besser Fussball spielen!",
                "(koennen) Hoffentlich ____ ihr beide gut Englisch, Mathematik und Deutsch!",
                "(koennen) Wir ____ sehr gut Englisch und Deutsch und Mathematik.",
                "(koennen) Juliane ____ viel besser Computer spielen als du! / Die Kinder ____ schneller laufen.",
                "(muessen) Alle ____ helfen. Frank, du ____ einkaufen.",
                "(muessen) Ihr ____ putzen. / Wir ____ putzen! Und Papa ____ nur einkaufen!",
                "(muessen) Ich ____ Waesche waschen und die Wohnung aufraeumen.",
                "(wollen) Wo ____ ihr Urlaub machen? / Wir ____ zu Oma fahren!",
                "(wollen) Juliane, ____ du nicht im Urlaub schwimmen?",
                "(wollen) Doch, ich ____ schwimmen. Aber Annika ____ zu Oma fahren.",
                "(wollen) Die Kinder ____ zu Oma fahren.",
                "(duerfen) Annika, du ____ jetzt nicht Computer spielen!",
                "(duerfen) Warum ____ ich nicht?",
                "(duerfen) ____ Juliane Computer spielen?",
                "(duerfen) Nein, ihr ____ nicht Computer spielen und ihr ____ auch nicht fernsehen.",
                "(duerfen) Wir ____ nicht fernsehen? Dann ____ Oma und Opa auch nicht fernsehen!",
                "(sollen) Der Arzt sagt, ich ____ nicht arbeiten.",
                "(sollen) Du ____ nicht arbeiten? Wer ____ dann den Garten machen?",
                "(sollen) ____ wir deine Eltern fragen?"
              ],
              answers: [
                "moechtest",
                "moechte / moechte",
                "moechte",
                "moechtet / moechten / moechten",
                "kann",
                "kannst / kann",
                "koennt",
                "koennen",
                "kann / koennen",
                "muessen / musst",
                "muesst / muessen / muss",
                "muss",
                "wollt / wollen",
                "willst",
                "will / will",
                "wollen",
                "darfst",
                "darf",
                "Darf",
                "duerft / duerft",
                "duerfen / duerfen",
                "soll",
                "sollst / soll",
                "Sollen"
              ]
            },
            {
              id: "4",
              title: "Welches Verb passt? Ergaenzen Sie.",
              lines: [
                "ich ____ Urlaub machen",
                "er, sie, es, man ____ Urlaub machen",
                "wir ____ Urlaub machen",
                "ihr ____ Urlaub machen",
                "sie, Sie ____ Urlaub machen"
              ],
              answers: [
                "moechte / kann / muss / will / soll",
                "moechte / kann / muss / will / soll",
                "moechten / koennen / muessen / wollen / sollen",
                "moechtet / koennt / muesst / wollt / sollt",
                "moechten / koennen / muessen / wollen / sollen"
              ]
            },
            {
              id: "5",
              title: "Schreiben Sie Saetze.",
              options: [
                "AM SONNTAG: 1) Am Sonntag / wir / lange / koennen / schlafen",
                "2) eine Freundin / Meine Tochter / besuchen / will",
                "3) sehen / Mein Mann / moechte / Fussball",
                "4) ich / muss / kochen / leider auch / Am Sonntag",
                "5) Am Nachmittag / wir / zusammen / spazieren gehen / moechten",
                "AUF DEM AUSLAENDERAMT: 1) ich / meine Aufenthaltserlaubnis / verlaengern / moechten",
                "2) Sie / in den dritten Stock / in Zimmer 325 / gehen / muessen",
                "3) ich / meinen Hund / mitnehmen / koennen ?",
                "4) Hunde / nicht ins Haus gehen / duerfen",
                "5) wo / der Hund / bleiben / sollen ?"
              ],
              lines: [
                "1 ____",
                "2 ____",
                "3 ____",
                "4 ____",
                "5 ____",
                "6 ____",
                "7 ____",
                "8 ____",
                "9 ____",
                "10 ____"
              ],
              answers: [
                "Am Sonntag koennen wir lange schlafen.",
                "Meine Tochter will eine Freundin besuchen.",
                "Mein Mann moechte Fussball sehen.",
                "Am Sonntag muss ich leider auch kochen.",
                "Am Nachmittag moechten wir zusammen spazieren gehen.",
                "Ich moechte meine Aufenthaltserlaubnis verlaengern.",
                "Sie muessen in den dritten Stock in Zimmer 325 gehen.",
                "Kann ich meinen Hund mitnehmen?",
                "Hunde duerfen nicht ins Haus gehen.",
                "Wo soll der Hund bleiben?"
              ]
            },
            {
              id: "6",
              title: "Ergaenzen Sie.",
              lines: [
                "Ich habe das gelernt / Es gibt die Moeglichkeit / Es ist nicht verboten -> ____",
                "Es ist mein Wunsch (direkt) -> ____",
                "Es ist mein Wunsch (hoeflich) -> ____"
              ],
              answers: [
                "koennen",
                "wollen",
                "moechten"
              ]
            },
            {
              id: "7",
              title: "Das Modalverb koennen. Welche Bedeutung passt? (1/2/3)",
              options: [
                "1 = Ich habe das gelernt.",
                "2 = Es gibt die Chance / die Moeglichkeit.",
                "3 = Es ist nicht verboten."
              ],
              lines: [
                "Ich kann gut Ski fahren. ____",
                "Aber es gibt hier keinen Schnee. Man kann nicht Ski fahren. ____",
                "Koennen Sie Englisch? ____",
                "Dann koennen Sie den Job in England machen. ____",
                "Koennen Sie nicht lesen? ____",
                "Hier ist Parken verboten. Aber da kann man parken. ____",
                "Ich kann das Auto nicht kaufen. Ich kann es nicht bezahlen. ____",
                "Und ich kann auch nicht Auto fahren. ____",
                "Er kann gut Schlagzeug spielen. ____",
                "Aber er kann nicht oft spielen. ____",
                "Jetzt ist es verboten und er kann nicht in seiner Wohnung spielen. ____"
              ],
              answers: [
                "1",
                "2",
                "1",
                "2",
                "1",
                "3",
                "2",
                "1",
                "1",
                "2",
                "3"
              ]
            },
            {
              id: "8",
              title: "wollen oder moechten? Ergaenzen Sie.",
              lines: [
                "Ich ____ gern einen Apfelsaft.",
                "Lisa ____ heute nicht in die Schule gehen.",
                "Was ____ Sie? / Wir ____ ein Kilo Tomaten, bitte.",
                "Peter ____ schon in einen Club gehen. Aber seine Eltern ____ das nicht.",
                "Sie koennen um 8 Uhr oder 9 Uhr kommen, wie Sie ____.",
                "Entschuldigung, ich ____ das Fenster oeffnen. Ist das okay fuer Sie?"
              ],
              answers: [
                "moechte",
                "will",
                "moechten / moechten",
                "will / wollen",
                "wollen",
                "moechte"
              ]
            },
            {
              id: "9",
              title: "wollen oder koennen? Ergaenzen Sie.",
              lines: [
                "Svetlana ____ schon gut Deutsch.",
                "Sie ____ naechstes Jahr unbedingt einen Sprachkurs machen.",
                "Sie ____ mehr Grammatik lernen.",
                "Sie ____ aber nur am Abend oder am Wochenende einen Kurs besuchen.",
                "____ Sie gut singen? Ich ____ es leider nicht.",
                "Ich ____ jetzt in einen Chor gehen und singen lernen.",
                "Kinder ____ immer viele Dinge haben.",
                "Aber nicht alle Eltern haben so viel Geld und ____ alles kaufen.",
                "Viele Eltern ____ ihren Kindern auch nicht alles kaufen."
              ],
              answers: [
                "kann",
                "will",
                "will",
                "kann",
                "Koennen / kann",
                "will",
                "wollen",
                "koennen",
                "wollen"
              ]
            },
            {
              id: "10",
              title: "moechten oder koennen? Ergaenzen Sie.",
              lines: [
                "Yvonne arbeitet viel und ____ nicht viel Urlaub machen.",
                "Manchmal ist sie krank und ____ nicht arbeiten.",
                "Sie ____ gerne mehr Zeit fuer die Kinder haben.",
                "Henry ____ jetzt gerne in Urlaub fahren.",
                "Aber er hat noch Schule, er ____ erst im Juli wegfahren.",
                "Emilia ____ noch nicht in die Schule gehen, aber sie ____ gerne in die Schule gehen wie Henry.",
                "Sie ____ noch nicht lesen, aber sie ____ schon ihren Namen schreiben.",
                "Die Familie ____ gerne einen Urlaub am Meer machen.",
                "Vielleicht ____ sie im Juli ans Meer fahren."
              ],
              answers: [
                "kann",
                "kann",
                "moechte",
                "moechte",
                "kann",
                "kann / moechte",
                "kann / kann",
                "moechte",
                "kann"
              ]
            },
            {
              id: "11",
              title: "IM BUERO. Ergaenzen Sie die Verben.",
              options: [
                "Set A: koennen (3x) · moechten (1x) · wollen (1x)",
                "Set B: wollen (1x) · moechten (2x) · koennen (2x)"
              ],
              lines: [
                "Ich ____ gerne ueber die Praesentation sprechen.",
                "Jetzt ____ ich nicht. ____ wir einen Termin in der naechsten Woche machen?",
                "Naechste Woche ____ ich nicht. Meine Frau und ich ____ nach Rom fahren.",
                "Wir ____ in die Kantine gehen. ____ Sie mitkommen?",
                "Ja, ich ____ sehr gerne. Aber ____ wir vielleicht in einer halben Stunde gehen?",
                "Wir ____ auch in einer Stunde gehen."
              ],
              answers: [
                "moechte",
                "kann / koennen",
                "kann / wollen",
                "wollen / moechten",
                "moechte / koennen",
                "koennen"
              ]
            },
            {
              id: "12",
              title: "Ergaenzen Sie.",
              lines: [
                "keine Alternative -> ____",
                "Es ist nicht notwendig. -> ____",
                "Es ist verboten. -> ____",
                "Es ist erlaubt. -> ____",
                "Der Arzt sagt... / Sollen wir...? / Soll ich...? -> ____"
              ],
              answers: [
                "muessen",
                "nicht muessen",
                "nicht duerfen",
                "duerfen",
                "sollen"
              ]
            },
            {
              id: "13",
              title: "muessen oder duerfen? Ergaenzen Sie.",
              lines: [
                "Hier ____ Maenner nicht hineingehen.",
                "Hier ____ man nach rechts fahren.",
                "Das ____ man nicht trinken.",
                "Hier ____ Kinder spielen und laut sein.",
                "Hier ____ man stoppen.",
                "Hier ____ man rauchen.",
                "Hier ____ man nicht mit dem Handy telefonieren.",
                "Hier ____ man langsam fahren."
              ],
              answers: [
                "duerfen",
                "muss",
                "darf",
                "duerfen",
                "muss",
                "darf",
                "darf",
                "muss"
              ]
            },
            {
              id: "14",
              title: "muessen oder sollen? Ergaenzen Sie.",
              lines: [
                "Lena ist krank. Sie ____ zum Arzt gehen.",
                "Die Aerztin sagt: Du ____ im Bett bleiben und du ____ viel schlafen und viel trinken.",
                "Lena sagt: Die Aerztin sagt, ich ____ im Bett bleiben und schlafen. Ich ____ nicht zur Schule gehen.",
                "Die Mutter fragt: ____ du Medizin nehmen? Lena antwortet: Nein, aber ich ____ viel trinken.",
                "Die Lehrerin sagt: Morgen ____ ihr einen Rucksack mitbringen. Ihr ____ auch eine Wasserflasche und ein Brot einpacken.",
                "Lena sagt: Die Lehrerin sagt, wir ____ morgen einen Rucksack mitbringen. Ich ____ auch eine Wasserflasche und ein Brot einpacken.",
                "Die Mutter fragt: ____ ihr um 8 Uhr in der Schule sein? Lena antwortet: Wir ____ schon frueher in der Schule sein."
              ],
              answers: [
                "muss",
                "musst / musst",
                "soll / soll",
                "Soll / soll",
                "sollt / sollt",
                "sollen / soll",
                "Sollt / sollen"
              ]
            },
            {
              id: "15",
              title: "muessen oder duerfen? Ergaenzen Sie.",
              lines: [
                "Mama, ____ ich jetzt spielen gehen? / Nein, du ____ deine Hausaufgaben machen.",
                "____ wir jetzt Pause machen? / Nein, ihr ____ noch die Aufgabe fertig machen.",
                "____ ich in der Wohnung einen Hund haben? / Nein. Sie ____ aber einen Vogel haben.",
                "Wie oft ____ ich die Treppe putzen? / Sie ____ einmal pro Monat die Treppe putzen.",
                "Sie ____ diese Tabletten nehmen. Und Sie ____ einmal pro Woche Sport machen."
              ],
              answers: [
                "darf / musst",
                "duerfen / muesst",
                "darf / duerfen",
                "muss / muessen",
                "muessen / muessen"
              ]
            },
            {
              id: "16",
              title: "nicht muessen oder nicht duerfen? Ergaenzen Sie.",
              lines: [
                "Sie ____ im Bett bleiben, Sie koennen aufstehen. Aber Sie ____ joggen oder Sport machen.",
                "Sie ____ die Treppe ____ alleine putzen.",
                "Du ____ zwei Seiten schreiben. Eine Seite ist genug. Aber du ____ aus dem Internet kopieren.",
                "Du ____ jetzt ____ dein Zimmer aufraeumen. Das kannst du morgen machen."
              ],
              answers: [
                "muessen nicht / duerfen nicht",
                "muessen / nicht",
                "musst nicht / darfst nicht",
                "musst / nicht"
              ]
            },
            {
              id: "17",
              title: "Machen Sie Vorschlaege mit sollen.",
              lines: [
                "Wir brauchen Getraenke. ____",
                "Es ist kalt hier. ____",
                "Ich habe Hunger. ____",
                "Ich lerne nicht gerne alleine. ____"
              ],
              answers: [
                "Sollen wir Getraenke kaufen?",
                "Soll ich das Fenster schliessen?",
                "Sollen wir etwas essen?",
                "Sollen wir zusammen lernen?"
              ]
            },
            {
              id: "18",
              title: "Fragen mit sollen.",
              lines: [
                "Ich habe Kopfschmerzen. ____",
                "Ich verstehe die Grammatik nicht. ____"
              ],
              answers: [
                "Soll ich dir eine Tablette bringen?",
                "Soll ich dir die Grammatik erklaeren?"
              ]
            },
            {
              id: "19",
              title: "Ergaenzen Sie muessen, koennen, duerfen oder wollen.",
              lines: [
                "In der Bibliothek: Sie ____ Buecher leihen. Sie ____ nicht essen. Sie ____ Ihren Bibliotheksausweis zeigen und Sie ____ nicht laut sprechen.",
                "Im Museum: Sie ____ Bilder sehen. Sie ____ bezahlen. Sie ____ manchmal nicht fotografieren, aber Sie ____ laut sprechen.",
                "Sie sind krank: Sie ____ im Bett bleiben. Sie ____ nicht rauchen. Sie ____ viel trinken.",
                "Kinder mit 10 Jahren: Sie ____ nicht rauchen und nicht Auto fahren. Sie ____ in die Schule gehen. Sie ____ oft keine Hausaufgaben machen.",
                "Im Auto: Sie ____ vielleicht Ihre Brille tragen. Sie ____ nicht schlafen, aber Sie ____ essen und sprechen."
              ],
              answers: [
                "koennen / duerfen / muessen / duerfen",
                "koennen / muessen / duerfen / duerfen nicht",
                "muessen / duerfen / muessen",
                "duerfen / muessen / wollen",
                "muessen / duerfen / koennen"
              ]
            }
          ],
          answerSheet: [
            "1-5: Kapitel 1.5（Konjugation + Satzposition）",
            "6-11: Kapitel 1.6（koennen / wollen / moechten）",
            "12-19: Kapitel 1.7（muessen / sollen / duerfen）"
          ],
          answerSheetNote: "按你的要求，1.5 到 1.7 已合并为同一个子单元，不再拆分。",
          quickExercises: []
        }
      }
    }
  };
})();
