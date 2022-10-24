//header info
# title: Disco Elysium Template
# author: isolatedphenomenon

/* Message @isolatedphenomenon on tumblr with any questions/comments/bugs!

 Notes: For a few of these features, there are multiple ways to use/customize them.
 
 Whenever I mention "skill" here as a tag (for #SPEAKER or #PORTRAIT), use the first three letters of the skill in lowercase (e.g. ele for electrochemistry, esp for esprit de corps)

CHOICES:
    <you> should be used before all "you" choices to force the appropriate style, except for skill checks.
    ▸ as a choice will provide a caps-locked continue popup.
    ■ as a choice will provide a caps-locked end popup.
    <read> in a choice will dim the choice; best used logically

SPEAKERS:
    <name><end> will provide a caps-locked white name.
    <int><end>, <psy><end>, <fys><end>, and <mot><end> will provide a caps-locked skill of the appropriate color.
    #SPEAKER: speaker will provide a caps-locked white name and hyphen, and #SPEAKER: skill will provide a caps-locked skill of the appropriate color
    (Either of the above works for both. I decided to keep them in case people wanted to customize skills here, like PERCEPTION (HEARING) for example; if you want completely new skills and want use of the tags, edit main.js.)

CHECKS:
    <red>, <white>, or <locked> in a choice will provide the appropriate style; locked is best used logically and will override white if both are present.
    (Since the game doesn't have different styling for the skills listed at the start of checks, you'll have to do that manually here! Include \[ and\] around your skill, which for a white skill, will be replaced with "Locked" if locked.)
    
    <check><end> will provide the correct color for post-skill name checks in the story text.
    #CHECK: difficulty-success will provide a check after the speaker for a given difficulty and success status. As with skills, use first three letters (e.g.: tri-suc for "Trivial: Success.")
    (Either of the above works. The first in combination with the first speaker method is good for when you want to have a one-off funny check (e.g. "Beyond Trivial - Epic Failure"), but note that #CHECK will only work if you use it before a #SPEAKER)
    
TASKS:    
    <task><end> will provide the correct color for tasks, thoughts, items, and XP.
    #CLASS: task will do the same thing
    (Use the first if you want only part of a paragraph to be formatted accordingly.)

PORTRAITS:
    #PORTRAIT: skill will prompt a portrait of the appropriate skill. "kim" and "harry" are also built-in portraits.
     Note that this is only possible at the end of text, NOT choices. Portraits will be cleared after a choice is made. More portraits (such as those of players) can be added; see main.js for instructions or to change the shorthand for skills.
     

#CLEAR clears the scroll, as per Ink norm, best used after a continue.

*/

*[▸] -> intro_knot

// Variables for this example
VAR appear = false
VAR prev = false
VAR ch1comp = "Challenging 20"
VAR goofed = false

=== intro_knot ===
#CLEAR
What's this? Another Disco Elysium fan game? #SPEAKER: some dumb game
*   <you> "More like the template for one."
    -> knot_one

===knot_one===
<name>some dumb game<end> — {That's because writing takes more brain power than coding, weirdly enough.|What else can I help you with?|Anything else I can help you with?}
// ^ another way of inserting names if you want to do something funky - don't do both!
+<you> "So what kind of interactive fiction logic can this do?" {cando: <read>}
-> cando
// ^ an example of setting a choice to "read" once you've visited a knot
+<you> "What about formatting?" {formatting: <read>}
 -> formatting
+<you> "What sucks about this?" {sucks: <read>}
 -> sucks
*<you> "Actually I'm done with questions, see ya."
-> goodbye
    

=== cando ===
Anything ink can do, but formatted like the Disco Elysium dialogue box. This includes cycles, changing text, trees, keeping track of variables, etc. #SPEAKER: some dumb game
    // v Since this was just a proof of product, I didn't want to make All my recurring choices dim when read. Sorry for being lazy, but there are plenty of examples of that!
    +<you> "Oh, I love Ink. I've already made 18 Ink games."
    +<you>"I usually use something else for IF."
    +<you> "What the fuck is Ink, what am I even doing here?"

- Well, in any case, there are people who are much better than me at using this language, so check the description if you need to for tutorial links. #SPEAKER: some dumb game
    + <you> "I've got some other questions."
    -> knot_one

=== formatting ===
{What about it?|Anything else?} #SPEAKER: some dumb game
    * {appear} <you> \[You nod appreciatively.\]
    // Code will automatically remove \[ and \] from paragraph after choice, so no need to use built in ink [] and duplicate unless you want the paragraph to be completely different (see e.g. below)
    
    The game somehow nods back at you. #SPEAKER: some dumb game
    -> formatting
    *<you>"Vanishing answers?"
    I mean, come on... #SPEAKER: some dumb game
    -> formatting
    +<you>"Appearing answers?" {appear: <read>} 
    You tell me. #SPEAKER: some dumb game
    -> setappear
    + <you>"Previously read answers?" {prev: <read>}
    You know the answer to that. #SPEAKER: some dumb game
     -> setprev 
    + <you>"Other kinds of text?" {othertext: <read>}
    -> othertext
    * {othertext} <you>"So what about skill checks?"
        ->skillchecks
    + <you> "I've got some other questions."
    -> knot_one

=== sucks ===
Well, version one of this meant that if you wanted your choices to show up as a paragraph after you choose them (like in DE), you'll have to do some copying and pasting. But I hacked the unhackable (according to the Ink discord) and now it sucks much less. #SPEAKER: some dumb game

+[▸]
// ^ continue button can be used before a gather or to go to a new knot

- Overall, Ink has some quirks that make it great for certain things, but not perfect at replicating DE; there's a bit of a learning curve with this weird custom formatting. #SPEAKER: some dumb game

+[▸]

- But it's the language I'm most comfortable in, and I figured I might as well share this in case that's true of someone else! #SPEAKER: some dumb game
    + <you>"I've got some other questions."
    -> knot_one


=== othertext ===
Oh, hell yeah. #SPEAKER: some dumb game

<task>New task: Figure out what else you can do. <end>

Thought gained: Make My Own Game #CLASS: task
// ^ both ways of setting tasks

+<you>"Okay..."

- It's really not that hard. #PORTRAIT: log #CHECK: eas-suc #SPEAKER: log
// ^ typical use of skills as speaker. Note #CHECK goes first.

+<you> "Ah, art! I'm an art person."
+<you> "Ugh, put it back. I like my IF text-based."

- Good news, you can opt in or out of using portraits. #SPEAKER: some dumb game

+<you>[\[Opt out\]] "I'm good."
// ^ using Ink [] to differentiate between a choice and what's written in the paragraph.

- <psy>empathy<end> — It's a bit rude of you not to want to look at us...

+<you>[\[Opt in\]] "Yeah, what the heck."

- <fys>physical instrument<end> — Especially considering how great I am to look at! #PORTRAIT: phy

    + <you>"I've got some other questions."
    -> formatting
    
=== skillchecks ===
#CLEAR

{This is going to take some concentration, let's clear out your head for a moment.|Clear your head again. Ready now?|How about now?} #SPEAKER: some dumb game
+[\[Composure — {ch1comp}\] "I've got this, I totally won't lock this skill check." <white> {goofed: <locked>}]
// ^ Composure etc. is written out here, like in the game. Include \[ and\] around your skill, which will be replaced with "Locked" if locked.
//Note the logic for <locked>, which will override white when true, and also note the Ink [] which prevent the text from showing up as a paragraph.
-> whitefail
+<you>"Let me take a breath {first|now}." {passwhite: <read>}
->passwhite


==passwhite==
 ~ goofed = false
 ~ ch1comp = "Trivial 1"
->skillchecks

==whitefail==
//v This is an example of a white check railroaded into failing at first and then passing (or passing if you chose the right option first). This is sometimes useful in IF if you're not in the mood to keep track of a whole 24 skills plus skill points and experience etc. 
{   - passwhite:
        <mot>Composure<end> <check> [Trivial: Success] <end> — Nice. You managed to withstand a skill check for once.
        // ^ another way of writing a skill and check text, for more customization.
        *[▸] ->redcheck
    

    - else: 
        I don't know what you were expecting here. #CHECK: cha-fai #SPEAKER: com
        ~goofed = true
        +<you> "I guess I'll try again?"
        ->skillchecks
}

=== redcheck ===
Why don't we do one more, and we'll actually roll some dice here? #SPEAKER: some dumb game

Boo! #SPEAKER: some dumb game

* [\[Reaction Speed - Trivial 6\] (Don't react.) <red>]

// v These are absolutely basic functions/logic/etc that can really be beefed up with more ink features, but a check that's NOT fixed could look like this:
~temp currentroll = roll_dice(0)
{  
    - currentroll>=6: 
        You're a stone cold machine. #CHECK: eas-suc #SPEAKER: rea
        ->machine

    - else:
        You jump. #CHECK: eas-fai #SPEAKER: rea
        -> scaredy_cat
        
}        
    
 === scaredy_cat ===
Okay, I think that's enough skill checks for now... #SPEAKER: some dumb game
 *[CONTINUE ▸]->formatting

===machine===
Nice! You've earned yourself a break from skill checks. #SPEAKER: some dumb game
 *[CONTINUE ▸]->formatting

=== goodbye ===
Thanks for taking a look! Credit for graphics, other Disco Elysium coding projects, Ink tutorials, and a link to the GitHub repository will be in the description of this game. #SPEAKER: some dumb game

Feel free to follow the README there to make a game of your own, and message me on tumblr @isolatedphenomenon if you have any questions/comments/bugs! #SPEAKER: some dumb game
*[■] ->DONE
// ^ An end option - doesn't necessarily need to be used at the "end" of a story


// my dice roll
=== function roll_dice(bonus) ===
    ~return RANDOM(1,6)+RANDOM(1,6)+bonus

// quick and dirty way of changing variables, I was too lazy to make a function
=== setappear ===
    ~ appear = true
    ->formatting

=== setprev ===
    ~ prev = true
    ->formatting



