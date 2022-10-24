(function(storyContent) {

    // Create ink story from the content using inkjs
    var story = new inkjs.Story(storyContent);

    // Global tags - those at the top of the ink file
    // We support:
    //  # title: Title
    //  # author: Your Name
    var globalTags = story.globalTags;
    if( globalTags ) {
        for(var i=0; i<story.globalTags.length; i++) {
            var globalTag = story.globalTags[i];
            var splitTag = splitPropertyTag(globalTag);
            
            // THEME: dark
            if( splitTag && splitTag.property == "theme" ) {
                document.body.classList.add(splitTag.val);
            }
            
            // author: Your Name
            else if( splitTag && splitTag.property == "author" ) {
                var byline = document.querySelector('.byline');
                byline.innerHTML = splitTag.val;
            }
        }
    }

    var storyContainer = document.querySelector('#story');
    var outerScrollContainer = document.querySelector('.outerContainer');
    
    var portrait = document.querySelector('.photoContainer')
    var portraitName = ""
    var charPhoto = document.querySelector('.charphoto');

    // If you want to include other portraits, put them in the folder and add to the dict
    // Sorry for not making this json but I gave up on that lol
    var portraits = {
        "kim" : "kim.jpg", // Kim goes first because he's first in all our hearts
        "harry" : "harry.jpg",
        "log" : "logic.jpg",
        "enc" : "encyclopedia.jpg",
        "rhe" : "rhetoric.jpg",
        "dra" : "drama.jpg",
        "con" : "conceptualization.jpg",
        "vis" : "visualcalculus.jpg",
        "vol" : "volition.jpg",
        "inl" : "inlandempire.jpg",
        "emp" : "empathy.jpg",
        "aut" : "authority.jpg",
        "esp" : "espritdecorps.jpg",
        "sug" : "suggestion.jpg",
        "end" : "endurance.jpg",
        "pai" : "painthreshold.jpg",
        "phy" : "physicalinstrument.jpg",
        "ele" : "electrochemistry.jpg",
        "shi" : "shivers.jpg",
        "hal" : "halflight.jpg",
        "han" : "handeyecoordination.jpg",
        "per" : "perception.jpg",
        "rea" : "reactionspeed.jpg",
        "sav" : "savoirefaire.jpg",
        "int" : "interfacing.jpg",
        "com" : "composure.jpg",
    }

    // Skills and their shorthands - add/modify this dict if you want individual skills!
    var int = {
        "log" : "Logic",
        "enc" : "Encyclopedia",
        "rhe" : "Rhetoric",
        "dra" : "Drama",
        "con" : "Conceptualization",
        "vis" : "Visual Calculus",
    }
    var psy = {
        "vol" : "Volition",
        "inl" : "Inland Empire",
        "emp" : "Empathy",
        "aut" : "Authority",
        "esp" : "Esprit de Corps",
        "sug" : "Suggestion",
    }
    var fys = {
        "end" : "Endurance",
        "pai" : "Pain Threshold",
        "phy" : "Physical Instrument",
        "ele" : "Electrochemistry",
        "shi" : "Shivers",
        "hal" : "Half Light",
    }
    var mot = {
        "han" : "Hand/Eye Coordination",
        "per" : "Perception",
        "rea" : "Reaction Speed",
        "sav" : "Savoire Faire",
        "int" : "Interfacing",
        "com" : "Composure",
    }

    var skills = {int, psy, fys, mot}


    // Skill difficulties/successes:
    var checks = {
        "tri" : "Trivial",
        "eas" : "Easy",
        "med" : "Medium",
        "cha" : "Challenging",
        "for" : "Formidable",
        "leg" : "Legendary",
        "her" : "Heroic",
        "god" : "Godly",
        "imp" : "Impossible",
        "suc" : "Success",
        "fai" : "Failure"
    }

    // Kick off the start of the story!
    continueStory(true);

    // Main story processing function. Each time this is called it generates
    // all the next content up as far as the next set of choices.
    function continueStory(firstTime) {

        var paragraphIndex = 0;
        var delay = 0.0;
        
        // Don't over-scroll past new content
        var previousBottomEdge = firstTime ? 0 : contentBottomEdgeY();

        // Generate story text - loop through available content
        while(story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();
            var tags = story.currentTags;
            var newInnerText = ''
            
            // Any special tags included with this line
            var customClasses = [];
            for(var i=0; i<tags.length; i++) {
                var tag = tags[i];

                // Detect tags of the form "X: Y". Currently used for IMAGE and CLASS but could be
                // customised to be used for other things too.
                var splitTag = splitPropertyTag(tag);

                // IMAGE: src
                if( splitTag && splitTag.property == "IMAGE" ) {
                    var imageElement = document.createElement('img');
                    imageElement.src = splitTag.val;
                    showAfter(delay, imageElement);
                    delay += 200.0;
                }

                // CLASS: className (used mainly for CLASS: task)
                else if( splitTag && splitTag.property == "CLASS" ) {
                    customClasses.push(splitTag.val);
                }

                //SPEAKER: speaker
                else if (splitTag && splitTag.property == "SPEAKER") {
                    var speaker = '<span class="name">'+splitTag.val+"</span> "
                    
                    // If it's a skill:
                    for(i in skills) {
                        if(skills[i][splitTag.val]) {
                            speaker = '<span class="'+i+'">'+skills[i][splitTag.val]+"</span> "
                        }
                    }
                    if(newInnerText) {
                        // This checks if there's a CHECK in play
                        newInnerText = speaker+newInnerText
                    } else {
                        newInnerText = speaker+'— '+paragraphText
                    }
                }

                //CHECK: che-ckk
                else if (splitTag && splitTag.property == "CHECK") {
                    var diff =checks[splitTag.val.split('-')[0]]
                    var succ=checks[splitTag.val.split('-')[1]]
                    newInnerText = '<span class="check">[' + diff + ': ' + succ+']</span> — '+paragraphText
                }

                //PORTRAIT: portrait
                else if( splitTag && splitTag.property == "PORTRAIT" ) {
                    portraitName = splitTag.val;
                    charPhoto.innerHTML = "<img src='images/"+portraits[portraitName]+"' alt = 'Portrait of speaker.'>";
                    // so that it doesn't flash between images
                    setTimeout(function() { portrait.style.display = "flex"; }, 10.0)
                    
                }

                // CLEAR - removes all existing content.
                // RESTART - clears everything and restarts the story from the beginning
                else if( tag == "CLEAR" || tag == "RESTART" ) {
                    removeAll("p");
                    removeAll("img");
                    
                    // Comment out this line if you want to leave the header visible when clearing
                    setVisible(".header", false);
                    firstTime = true;

                    if( tag == "RESTART" ) {
                        restart();
                        return;
                    }
                }
            }

            // Create paragraph element (initially hidden)
            var paragraphElement = document.createElement('p');
            if (newInnerText) {
                paragraphText=newInnerText
            }

            // Logic that adds classes to text based on flags in ink 
            paragraphText = paragraphText.replace(/<end>/g, '</span>')

            paragraphText = paragraphText.replace(/<name>/g, '<span class="name">')
            paragraphText = paragraphText.replace(/<int>/g, '<span class="int">')
            paragraphText = paragraphText.replace(/<psy>/g, '<span class="psy">')
            paragraphText = paragraphText.replace(/<fys>/g, '<span class="fys">')
            paragraphText = paragraphText.replace(/<mot>/g, '<span class="mot">')

            paragraphText = paragraphText.replace(/<check>/g, '<span class="check">')
            paragraphText = paragraphText.replace(/<task>/g, '<span class="task">')

           


            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);
            
            // Logic specific to YOU choices
            var first_paragraph = document.querySelector("p:not(.greyed)");
            if (first_paragraph.innerHTML.includes('<you>')) {
                paragraphElement.classList.add("you");
                paragraphElement.classList.add("greyed");
                
                // This automatically removes [] from choices; comment out if not desired.
                var newtext = first_paragraph.innerHTML.replace(/\[/g, '');
                newtext = newtext.replace(/\]/g, '');
                first_paragraph.innerHTML = newtext;
                
            }

            // Add any custom classes derived from ink tags
            for(var i=0; i<customClasses.length; i++)
                paragraphElement.classList.add(customClasses[i]);
            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);
            delay += 100.0;

        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function(choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');

            // Logic that adds classes to choices based on flags in ink
            if (choice.text.includes('▸')) {
                choiceParagraphElement.classList.add("continue");
                choice.text = "CONTINUE ▸";
            } else if (choice.text.includes('■')) {
                choiceParagraphElement.classList.add("continue");
                choice.text = "END ■";
            } else if (choice.text.includes('<locked>')) {
                choiceParagraphElement.classList.add("locked");
                choiceParagraphElement.classList.add("choice");
                var textArray = choice.text.split('[')
                var textPartOne = textArray[0]
                var textPartTwo = textArray[1].split(']')[1]
                choice.text = textPartOne + "[Locked]" +textPartTwo

            } else if (choice.text.includes('<red>')) {
                choiceParagraphElement.classList.add("red");
                choiceParagraphElement.classList.add("choice");
            } else if (choice.text.includes('<white>')) {
                choiceParagraphElement.classList.add("white");
                choiceParagraphElement.classList.add("choice");
            } else if (choice.text.includes('<read>')) {
                choiceParagraphElement.classList.add("read");
                choiceParagraphElement.classList.add("choice");
            } else {
                choiceParagraphElement.classList.add("choice");
            }

            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += 1.0;

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function(event) {

                // Don't follow <a> link
                event.preventDefault();

                //This is the code that makes the previous paragraphs grey out
                var all_paragraphs = document.querySelectorAll('p');
                for (const element of all_paragraphs) {
                    element.classList.add("greyed");
                }

                // Remove all existing choices
                removeAll("p.continue");
                removeAll("p.choice");

                // Remove the portrait
                portrait.style.display = "none";

                // Tell the story where to go next
                story.ChooseChoiceIndex(choice.index);

                // Aaand loop
                continueStory();
            });
        });

        // Extend height to fit
        // We do this manually so that removing elements and creating new ones doesn't
        // cause the height (and therefore scroll) to jump backwards temporarily.
        
        storyContainer.style.height = contentBottomEdgeY()+"px";
        
        if( !firstTime ) {
            scrollDown(previousBottomEdge);} else {outerScrollContainer.scrollTo(0, 0)}
    }

    function restart() {
        story.ResetState();

        setVisible(".header", true);

        continueStory(true);

        outerScrollContainer.scrollTo(0, 0);
    }

    // -----------------------------------
    // Various Helper functions
    // -----------------------------------

    // Fades in an element after a specified delay
    function showAfter(delay, el) {
        el.classList.add("hide");
        setTimeout(function() { el.classList.remove("hide") }, delay);
    }

    // Scrolls the page down, but no further than the bottom edge of what you could
    // see previously, so it doesn't go too far.
    function scrollDown(previousBottomEdge) {

        // Line up top of screen with the bottom of where the previous content ended
        var target = previousBottomEdge;
        
        // Can't go further than the very bottom of the page
        var limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
        if( target > limit ) target = limit;

        var start = outerScrollContainer.scrollTop;

        var dist = target - start;
        var duration = 300 + 300*dist/100;
        var startTime = null;
        function step(time) {
            if( startTime == null ) startTime = time;
            var t = (time-startTime) / duration;
            var lerp = 3*t*t - 2*t*t*t; // ease in/out
            outerScrollContainer.scrollTo(0, (1.0-lerp)*start + lerp*target);
            if( t < 1 ) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // The Y coordinate of the bottom end of all the story content, used
    // for growing the container, and deciding how far to scroll.
    function contentBottomEdgeY() {
        var bottomElement = storyContainer.lastElementChild;
        return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
    }

    // Remove all elements that match the given selector. Used for removing choices after
    // you've picked one, as well as for the CLEAR and RESTART tags.
    function removeAll(selector)
    {
        var allElements = storyContainer.querySelectorAll(selector);
        for(var i=0; i<allElements.length; i++) {
            var el = allElements[i];
            el.parentNode.removeChild(el);
        }
    }

    // Used for hiding and showing the header when you CLEAR or RESTART the story respectively.
    function setVisible(selector, visible)
    {
        var allElements = storyContainer.querySelectorAll(selector);
        for(var i=0; i<allElements.length; i++) {
            var el = allElements[i];
            if( !visible )
                el.classList.add("invisible");
            else
                el.classList.remove("invisible");
        }
    }

    // Helper for parsing out tags of the form:
    //  # PROPERTY: value
    // e.g. IMAGE: source path
    function splitPropertyTag(tag) {
        var propertySplitIdx = tag.indexOf(":");
        if( propertySplitIdx != null ) {
            var property = tag.substr(0, propertySplitIdx).trim();
            var val = tag.substr(propertySplitIdx+1).trim(); 
            return {
                property: property,
                val: val
            };
        }

        return null;
    }

})(storyContent);