Since this app was created as part of the hackathon it is not guaranteed to work.    

![Screenshot](https://raw.github.com/RallyHackathon/CapacityUtilizationByRank/master/deploy/Screenshot.png)

Capacity Utilization By Rank

    This App will help answer the question "How is our organization spending our 
    capacity, relative to our top-ranked projects?" 
    
    We are using "User Stories" as a proxy for projects. Future enhancements would probably want to 
    substitute Portfolio hierarchies down through the UserStory hierarchy.
    
    The app lists the top 30 stories (and epics) by rank order and shows percentage utilization of our
    available capacity over the selected time range.
    
    Usage:
    
    Select the starting and ending dates on the top bar - to set the date range 
    under consideration. Future enhancements will:
    
    * Enable you to select the number of top ranked items (currently hard-coded = 30). 
    * Set the project task hours per day (currently set = 4 hours)
    * Set the Story Points per Day (currently set = 1 sp / day)
    * Set the number of available team members (currently set = 3)
    * Cause the load to present the "Percent Done" inline on each displayed UserStory record so
        that you would see many rows of UserStories (aka Projects), each with a Percent Utilization
        of the available capacity. If the highest capacity utilitization is NOT at the top of the
        story ranking, our VP is going to be really put out.
        
    * We were going to do really cool and beautiful styling too...
    * Our treatment of the record styling disabled the hyperlink to the UserStory detail, 
        future enhancements would restore that link.
        
    Our plan was to set these items into a Preference Object keyed to project folder and the App.
    
    Authors/Direction: Erika Brice (awesome coding and instruction to ) Steve Rhoads - providing the 
    real-life problem and a second pair of eyes on code.
    
Video on [Screencast](http://www.screencast.com/users/SteveRhoads/folders/Default/media/4f28b3e5-e14e-4377-8e9a-56e0edae287f)