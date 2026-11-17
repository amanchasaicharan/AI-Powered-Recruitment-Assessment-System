require("dotenv").config();

async function test() {

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY
            },

            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                 {
                  role:"system",
                  content:"You are the police officer you need to solve the case"
                 },
                 {
                  role:"user",
                  content:"A wealthy art gallery owner, Arthur Pendelton, was found dead in his locked office at 9:00 PM on a rainy Tuesday. The cause of death was a blow to the head. The heavy oak door was bolted from the inside, and the only window was locked shut with no way out. Arthur sits slumped at his desk. A shattered porcelain coffee cup lies on the rug. A small digital clock on the desk is frozen and unplugged, showing 3:15 PM. No signs of a forced entry. The indoor humidity is very high, and the window glass is covered in thick condensation on the inside. Three people had access to the building that afternoon. Mark, the business partner, claims he dropped off invoice papers at 2:00 PM and left immediately. Elena, the cleaner, says she wiped the outer hallway floors at 3:00 PM and heard Arthur arguing loudly with someone inside. Julian, the rival collector, says he came at 4:30 PM, knocked, got no answer, and assumed Arthur went home. The police note that the room's AC unit was switched completely off, and the outdoor temperature was very cold. Who is the killer, and what clue exposes their lie?"
                 }
                        ]
            })
        }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log(data.choices[0].message.content);
}

test();