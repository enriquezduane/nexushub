// Mock Database for NexusHub Forum
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

users = [
    { 
        _id: new mongoose.Types.ObjectId(),
        username: "lokitrickster", 
        role:"Forum Master", 
        age: 20,
        createdAt: new Date("Jan 19, 2024"),
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "Joshua", 
        role:"Forum Master",  
        age: 19, 
        joinDate: "Jan 19, 2024",
        createdAt: new Date("Jan 19, 2024"),
        currentServer: "NovaRO"
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "Duane", 
        role: "Forum Master",  
        age: 20, 
        createdAt: new Date("Jan 19, 2024"),
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "LightYagami", 
        role:"Novice Adventurer",  
        age: 18, 
        createdAt: new Date("Jan 25, 2024"),
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "OrcLordDaddy", 
        role:"Novice Adventurer",  
        age: "20", 
        createdAt: new Date("Jan 27, 2024"),
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "GrumpyMage", 
        role:"Novice Adventurer",  
        age: 19, 
        createdAt: new Date("Jan 27, 2024"),
        currentServer: "OriginsRO" 
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "ZenyMaster", 
        role:"Novice Adventurer",  
        age: 21, 
        createdAt: new Date("Jan 28, 2024"),
        currentServer: "auRO" 
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "ShadowDuelist", 
        role:"Novice Adventurer",  
        age: 18, 
        createdAt: new Date("Jan 29, 2024"),
        currentServer: "iRO Classic" 
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "CrossPlatformer", 
        role:"Novice Adventurer",  
        age: 19, 
        createdAt: new Date("Feb 01, 2024"),
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "frozenDev", 
        role:"Novice Adventurer",  
        age: 24, 
        createdAt: new Date("Feb 01, 2024"),
        currentServer: "FrozenRO" 
    },

    { 
        _id: new mongoose.Types.ObjectId(),
        username: "EternalWanderer", 
        role:"Novice Adventurer",  
        age: 22, 
        createdAt: new Date("Feb 02, 2024"),
        currentServer: "HiraniRO" 
    },
]

users.forEach(user => {
    // Construct the directory path of the profile pictures
    const profilePicturesDir = path.join(__dirname, '..', '..', 'public', 'profilePictures');
    
    // Read the files in the profilePicturesDir
    fs.readdirSync(profilePicturesDir).forEach(file => {
        // Construct the full file path
        const filePath = path.join(profilePicturesDir, file);
        
        // Check if the file contains the user's username and if it exists
        if (file.includes(user.username) && fs.existsSync(filePath)) {
            // If the file exists, add its path to the user object
            user.profilePicture = `/profilePictures/${file}`;
        }
    });
});



users.forEach(async (user) => {
    try {
        const salt = await bcrypt.genSalt(10);
        let passwordToHash;
        if (user.role === "Forum Master") {
            passwordToHash = "admin";
        } else {
            passwordToHash = "user";
        }
        const hashedPassword = await bcrypt.hash(passwordToHash, salt);
        user.password = hashedPassword;
    } catch (error) {
        console.error(`Error hashing password for user ${user.username}:`, error);
    }
});

users.forEach(user => {
    user.email = `${user.username}@gmail.com`;
});

users.forEach(user => {
    user.updatedAt = user.createdAt;
});

replies = [
    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Can we get a light mode, please?",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Jan 28, 2024, 09:29 AM"),
        reply: `
        The forum already looks good enough and dark mode is usually preferred by people
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Can we get a light mode, please?",
        refPost: null,
        poster: users[5]._id,
        createdAt: new Date("Jan 28, 2024, 04:21 PM"),
        reply: `
        As said by the guy above, also I dont really get why someone would prefer light mode over dark mode haha
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Why does the MVP always spawn when I'm AFK?!",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Jan 29, 2024, 08:33 AM"),
        reply: `
        orc lord is the daddy for a reason ^__^
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Why does the MVP always spawn when I'm AFK?!",
        refPost: null,
        poster: users[5]._id,
        createdAt: new Date("Jan 29, 2024, 08:56 AM"),
        reply: `
        your name really fits the situation LOL
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Why does the MVP always spawn when I'm AFK?!",
        refPost: null,
        poster: users[6]._id,
        createdAt: new Date("Jan 29, 2024, 02:28 PM"),
        reply: `
        Lesson learned: dont afk at an MVP spawn map :)
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: NexusHub Forum Upgraded",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Jan 30, 2024, 11:30 PM"),
        reply: `
        Looks super fancy!!! :)
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Ultimate Guide to Zeny Farming 2024 Edition",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Feb 01, 2024, 8:14 AM"),
        reply: `
        Wowww!! Well-made content right here. Thank you for this!
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Ultimate Guide to Zeny Farming 2024 Edition",
        refPost: null,
        poster: users[5]._id,
        createdAt: new Date("Feb 01, 2024, 11:52 AM"),
        reply: `
        Amazing guide bro thanks for the effort to create this!
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Frozen Ragnarok Online (HighRate)",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Feb 02, 2024, 9:11 AM"),
        reply: `
        looks like a cool server, might join for a bit and chill :))
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Assassin Cross vs Sniper, which is better for PvP?",
        refPost: null,
        poster: users[5]._id,
        createdAt: new Date("Feb 02, 2024, 9:11 AM"),
        reply: `
        while im no master at either of those jobs, I think that the sinX will easily win with cloaking sb build
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Assassin Cross vs Sniper, which is better for PvP?",
        refPost: null,
        poster: users[4]._id,
        createdAt: new Date("Feb 02, 2024, 02:39 AM"),
        reply: `
        a sinX probably wont be able to hit a sniper with full agi stats
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Assassin Cross vs Sniper, which is better for PvP?",
        refPost: null,
        poster: users[6]._id,
        createdAt: new Date("Feb 02, 2024, 12:03 PM"),
        reply: `
        as he said, the sinx wont be able to hit the sniper unless the sinx has a good build already (sniper all the way because of zeny farming lol)
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: Ragnarok Mobile vs. Ragnarok Online - Thoughts?",
        refPost: null,
        poster: users[7]._id,
        createdAt: new Date("Feb 02, 2024, 4:13 PM"),
        reply: `
        For me, there is no better of the two. Ragnarok Mobile is pretty much way better for people that are always busy and just want some casual gameplay without being left out by hardcore players that much. Ragnarok PC however is for hardcore grinders since Ragnarok is a very grindy game in the PC Version.
              `,
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Re: HiraniRO 5x5x5x",
        refPost: null,
        poster: users[7]._id,
        createdAt: new Date("Feb 03, 2024, 03:41 PM"),
        reply: `
        seems like a promising server, I might consider joining if the population is high since low rates need a ton of grinding to get some levels up
              `,
    },
]

posts = [
    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Getting Started: A Beginner's Guide to NexusHub", 
        poster: users[2]._id,
        createdAt: new Date("Jan 20, 2024, 03:51 PM"),
        content: `
        Welcome to NexusHub, adventurers! Whether you're a seasoned Ragnarok Online player or a newcomer
        to the world of Midgard, this guide is here to help you navigate our forum and get the most out of
        your experience.
        <br><br>
        <strong>1. Introduction to NexusHub</strong>:
        NexusHub is more than just a forum; it's a vibrant community of Ragnarok Online enthusiasts.
        Here, you can connect with fellow players, share tips and strategies, seek advice, and stay
        updated on the latest news and events in the world of RO.
        <br><br>
        <strong>2. Forum Navigation</strong>:
        Before diving into discussions, familiarize yourself with our forum's layout. We have dedicated
        sections for different aspects of Ragnarok Online, including High-Rate and Low-Rate Servers,
        General Discussions, Job Discussions, Guides, and more.  Take some time to explore these
        categories and find the ones that  interest you the most.
        <br><br>
        <strong>3. Introduce Yourself</strong>:
        Don't be shy! Head over to our General Discussion section and make a post introducing yourself to
        the community. Share your IGN (In-Game Name), your favorite jobs, and what brings you to NexusHub.
        Our members are friendly and welcoming, and they'd love to get to know you better.
        <br><br>
        <strong>4. Ask Questions</strong>:
        Have burning questions about Ragnarok Online mechanics, builds, or strategies? Our General and Job Discussion
        sections are the perfect place to seek answers. Don't hesitate to ask for help or advice from our experienced
        players. Remember, there's no such thing as a dumb question!
        <br><br>
        <strong>5. Guides and Tutorials</strong>:
        Looking to improve your gameplay or master a new class? Check out our Guides and Job Discussion section
        for in-depth resources created by our community members. From leveling guides to advanced PvP tactics,
        you'll find a wealth of knowledge to enhance your RO experience.
        <br><br>
        <strong>6. Events and Contests</strong>:
        While we don't have any events and contests yet since our forum is fairly new, we do plan to make a lot in
        the future though! Stay tuned and wait for announcements regarding this when the time comes.
        <br><br>
        <strong>7. Socialize and Make Friends</strong>:
        NexusHub isn't just about gaming; it's also about building friendships and connections. Join discussions,
        participate in guild recruitment threads, or simply hang out in our off-topic section to chat about anything and
        everything. You never know, you might meet your future party members or guildmates here!
        <br><br>
        <strong>8. Rules and Guidelines</strong>:
        Last but not least, familiarize yourself with our forum rules and guidelines. We strive to maintain a friendly and
        respectful community, and adherence to our rules ensures a positive experience for everyone. Remember to respect your
        fellow players, keep discussions civil, and report any violations to our moderators.
        <br><br>
        Welcome aboard, adventurers! We're thrilled to have you join us on this epic journey through the world of
        Ragnarok Online. Whether you're here to seek knowledge, share experiences, or simply have fun, NexusHub is your
        ultimate destination for all things RO. Dive in, explore, and may your adventures be legendary, Rok On!
              `,
        replies: [],
        views: 102,
        pinned: true,
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Server Roles", 
        poster: users[0]._id,
        createdAt: new Date("Jan 20, 2024, 05:27 PM"),
        content: `
            Greetings Adventurers!
            <br><br>
            As our community continues to grow and evolve, it's essential to establish clear roles and
            responsibilities to ensure smooth operation and effective moderation. The roles have a hierarchy
            system which will allow more features to members that have contributed more posts. These roles
            will appear below your name when you create a post or reply to posts made. Here are the server roles
            we've defined to help maintain order and promote positive interactions within our forum:
            <br><br>
            <strong>Novice Adventurer</strong> - Newly joined members
            <br>
            <strong>Initiate Acolyte</strong> - 2 Posts
            <br>
            <strong>Rookie Blacksmith</strong> - 5 Posts
            <br>
            <strong>Journeyman Wizard</strong> - 10 Posts
            <br>
            <strong>Veteran Archer</strong> - 20 Posts
            <br>
            <strong>Elite Knight</strong> - 40 Posts
            <br>
            <strong>Master Assassin</strong> - 75 Posts
            <br>
            <strong>Grandmaster Scholar</strong> - 150 Posts
            <br>
            <strong>Forum Master</strong> - Admins only / Unobtainable
            <br><br>
            Here are the roles' appearances when they are below your username:
            <br>
            <span style="line-height: 10rem; font-size: 40px">
                <span class="novice-adventurer">Novice Adventurer</span>
                <br>
                <span class="initiate-acolyte">Initiate Acolyte</span>
                <br>
                <span class="rookie-blacksmith">Rookie Blacksmith</span>
                <br>
                <span class="journeyman-wizard">Journeyman Wizard</span>
                <br>
                <span class="veteran-archer">Veteran Archer</span>
                <br>
                <span class="elite-knight">Elite Knight</span>
                <br>
                <span class="master-assassin">Master Assassin</span>
                <br>
                <span class="grandmaster-scholar">Grandmaster Scholar</span>
                <br>
                <span class="forum-master">Forum Master</span>
            </span>
              `,
        replies: [],
        views: 86,
        pinned: true,
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Forum Rules", 
        poster: users[1]._id,
        createdAt: new Date("Jan 20, 2024, 08:54 PM"),
        content: `
        Hello NexusHub Members,
        <br><br>
        As the administrator of NexusHub, I'd like to take a moment to remind everyone of our forum rules.
        These rules are put in place to ensure a respectful, constructive, and enjoyable environment for all
        members. Please take a moment to review them:
        <br><br>
        <strong>1. Respect Others</strong>: Treat all members with respect and courtesy. Personal attacks, insults,
        harassment, or any form of discrimination will not be tolerated.
        <br><br>
        <strong>2. No Hate Speech or Offensive Content</strong>: Do not post any content that promotes hate speech, racism,
        sexism, homophobia, or any form of discrimination. This includes offensive language, images, or links.
        <br><br>
        <strong>3. Keep it Civil</strong>: Debate and discussion are encouraged, but it must remain civil.
        Avoid flame wars, trolling, or baiting other members.
        <br><br>
        <strong>4. Stay on Topic</strong>: Keep discussions relevant to the forum categories and threads.
        Off-topic posts may be removed or moved to the appropriate section.
        <br><br>
        <strong>5. No Spam or Self-Promotion</strong>: Do not spam the forum with irrelevant or repetitive content.
        Avoid excessive self-promotion, advertising, or affiliate links. Promotion of other forums or
        websites requires prior approval from the moderators. Please only promote on the appropriate
        channels for promoting!
        <br><br>
        <strong>6. Respect Privacy</strong>: Do not share personal information about yourself or others without consent.
        Respect the privacy of fellow members.
        <br><br>
        <strong>7. Copyright and Intellectual Property</strong>: Do not post copyrighted material unless you have
        permission to do so. Always give credit to the original source when sharing content.
        <br><br>
        <strong>8. No Illegal Activities</strong>: Do not engage in or promote any illegal activities, including
        but not limited to piracy, hacking, or sharing of illegal software or content.
        <br><br>
        <strong>9. Moderator Instructions</strong>: Follow the instructions of moderators and administrators. If you
        have concerns or questions, contact them privately rather than publicly disputing their decisions.
        <br><br>
        <strong>10. Report Violations</strong>: If you see any violations of these rules, report them to the moderators
        using the appropriate channels. Do not engage in vigilante actions.
        <br><br>
        <strong>11. Multiple Accounts</strong>: Only one account per user is allowed. Creating multiple accounts may
        result in a ban.
        <br><br>
        <strong>12. Language and Tone</strong>: Use clear and respectful language. Avoid excessive swearing, offensive
        language, or aggressive tones.
        <br><br>
        <strong>13. Quality Contributions</strong>: Strive to contribute meaningful and constructive content to the forum.
        Avoid low-effort or one-word responses.
        <br><br>
        <strong>14. Stay Informed</strong>: Familiarize yourself with the forum's guidelines and rules. Ignorance of
        the rules is not an excuse for violating them.
        <br><br>
        <strong>15. Importance of Rules</strong>: These rules are crucial for maintaining a positive and thriving community here at NexusHub.
        Please ensure that you follow them in all your interactions on the forum. If you have any questions
        or concerns about these rules, feel free to reach out to me or any of our moderators.
        <br><br>
        Thank you for your attention, and let's continue to make NexusHub a welcoming and engaging space for all :).
              `,
        replies: [],
        views: 78,
        pinned: true,
    },  

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Can we get a light mode, please?", 
        poster: users[3]._id,
        createdAt: new Date("Jan 28, 2024, 08:30 AM"),
        content: `
        I prefer browsing with light mode on (don't ask me why), so if it's possible in the future, could we
        get a dark mode for the forum? :)
              `,
        replies: [replies[0]._id, replies[1]._id],
        views: 45
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Why does the MVP always spawn when I'm AFK?!", 
        poster: users[5]._id,
        createdAt: new Date("Jan 28, 2024, 11:59 PM"),
        content: `
        this is so frustrating bro, this has happened to me like 3 times now, I was just sitting at orc village while I was eating my food, and then I come back to my character dead to Orc Lord :<
              `,
        replies: [replies[2]._id, replies[3]._id, replies[4]._id],
        views: 87
    },  

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Getting your first job: A Beginner's Guide to Ragnarok Online", 
        poster: users[0]._id,
        createdAt: new Date("Jan 29, 2024, 04:42 PM"),
        content: `
        Welcome, aspiring adventurers, to the world of Ragnarok Online! Embarking on your journey
        into Midgard can be both exciting and daunting, especially when it comes to choosing and
        advancing your first job. Fear not, for this beginner's guide is here to help you navigate
        the process and set you on the path to greatness.
        <br><br>
        1. Understanding the Basics:
        <br>
        Before delving into job advancements, it's essential to grasp the fundamentals of Ragnarok Online.
        Familiarize yourself with the game's mechanics, controls, and user interface. Take some time to
        explore Prontera, the starting city, and interact with NPCs to learn more about the world around you.
        <br><br>
        2. Choosing Your First Job:
        <br>
        In Ragnarok Online, players begin their journey as Novices, the jack-of-all-trades class.
        As you gain experience and reach Base Level 10, you'll have the opportunity to choose your
        first job. Consider your preferred playstyle, whether it's dealing damage up close, casting
        spells from a distance, or providing support to your party members. Research the available
        job classes and their respective skills to find the one that suits you best.
        <br><br>
        3. Job Advancement Quests:
        <br>
        Once you've made your decision, it's time to undergo the job advancement process. Each
        job class has its own unique quest that must be completed to advance. These quests often
        involve gathering items, defeating monsters, or performing tasks for NPCs. Pay close
        attention to the quest requirements and follow the instructions carefully to successfully
        advance to your chosen job.
        <br><br>
        4. Building Your Character:
        <br>
        As you progress through your chosen job class, you'll have the opportunity to
        customize your character's skills and attributes. Experiment with different builds
        to find the playstyle that best suits you. Whether you prefer to specialize in offensive,
        defensive, or supportive abilities, there's a build out there to match your preferences.
        Don't be afraid to seek advice from experienced players or consult online guides for build
        recommendations.
        <br><br>
        5. Leveling Up and Exploring:
        <br>
        With your new job class in hand, it's time to venture forth into the world of Ragnarok Online
        and embark on your quest for adventure. Explore new maps, defeat monsters, complete quests,
        and participate in party activities to level up and improve your skills. Take advantage of the
        game's social features to join parties, make friends, and tackle challenges together.
        <br><br>
        6. Embracing the Journey:
        <br>
        Remember, Ragnarok Online is not just about reaching the highest level or obtaining the most
        powerful gear. It's about the experiences you have along the way, the friends you make, and
        the adventures you embark on together. Embrace the journey, savor the moments, and enjoy
        everything that Midgard has to offer.
        <br><br>
        Congratulations on taking your first steps into the world of Ragnarok Online! May your journey be filled with excitement, discovery, and countless epic battles. If you ever find yourself in need of guidance or assistance, don't hesitate to reach out to your fellow adventurers. Welcome to Midgard, and may your adventures be legendary!
             `,
        replies: [],
        views: 82
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "NexusHub Forum Upgraded", 
        poster: users[0]._id,
        createdAt: new Date("Jan 30, 2024, 10:45 PM"),
        content: `
        Welcome to the newest upgrade of the forum!
        <br><br>
        The forum has been upgraded. Let's thank our admins for the hard work that they have put in to
        improve the quality of NexusHub!!
        <br><br>
        Back to the details
        <br><br>
        The theme from the previous version doesn't work with the upgraded version.  I will try to move
        back some of the elements from the old theme if possible as we progress.  This newer version of
        the forum is more modern and user-friendly, it will take some time to get used to (for me at least).
        I haven't take the time to discover all the features and to check if everything is working
        as they should.  So please let me know if you find something is missing, broken or out of place.
        <br><br>
        The NexusHub search page is not yet fully complete.  I will have to fix it later.
        The shoutbox will not come back, I can't find a substitute for it that works, but it should be fine.
        It should be a good idea to do without that many add-ons going forward so upgrading will not be as painful.
        <br><br>
        On a side note ...
        <br><br>
        It's not too late to go back to the old version  /heh but then we will have to stuck with it
        for as long as the forum stay alive.  Given the usage, I think we can live with this unless there
        is a very good reason to go back to the old version. Thank you all for your continued support!!
              `,
        replies: [replies[5]._id],
        views: 54
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Ultimate Guide to Zeny Farming 2024 Edition", 
        poster: users[6]._id,
        createdAt: new Date("Jan 31, 2024, 12:30 PM"),
        content: `
        Greetings, fellow adventurers!
        <br><br>
        Are you ready to amass wealth and fortune in the realm of Midgard? Look no further,
        for the Ultimate Guide to Zeny Farming is here to equip you with the knowledge and strategies
        you need to become a master of economic prosperity in Ragnarok Online.
        <br><br>
        1. Understanding Zeny:
        <br>
        Zeny is the currency of Midgard, and mastering the art of Zeny farming is essential for funding
        your adventures. Whether you're saving up for that coveted rare item or aiming to build your
        dream equipment set, knowing how to earn Zeny efficiently is key.
        <br><br>
        2. Choosing the Right Farming Method:
        <br>
        There are countless ways to earn Zeny in Ragnarok Online, from hunting monsters for loot to
        crafting and trading items in the marketplace. Each method has its own pros and cons, so it's
        essential to choose the one that aligns with your playstyle and goals. Explore different farming
        spots, professions, and strategies to find the most lucrative option for you.
        <br><br>
        3. Efficient Farming Routes and Techniques:
        <br>
        Maximize your Zeny farming efficiency by optimizing your farming routes and techniques. Identify
        high-value monsters, items, or materials that yield the best returns on your time and effort.
        Consider factors such as monster respawn rates, mob density, and drop rates to maximize your
        earnings per hour.
        <br><br>
        4. Leveraging Professions and Skills:
        <br>
        Certain professions and skills offer unique opportunities for Zeny farming. Whether you're a
        Blacksmith crafting valuable equipment, an Alchemist brewing potions and consumables, or a
        Merchant haggling for the best deals, there's a profession suited to your money-making goals.
        Invest in leveling up your skills and unlocking lucrative abilities to boost your earning potential.
        <br><br>
        5. Market Analysis and Trading Strategies:
        <br>
        Stay informed about market trends and fluctuations to capitalize on buying low and selling high.
        Keep an eye on popular items, consumables, and equipment that are in high demand among players.
        Learn to identify profitable opportunities and employ smart trading strategies to grow your
        wealth over time.
        <br><br>
        6. Farming in Parties and Guilds:
        <br>
        Joining forces with other players can significantly increase your Zeny farming efficiency.
        Form parties to tackle challenging monsters or participate in guild activities such as MVP
        hunting or dungeon runs. Pooling resources and coordinating efforts with fellow adventurers
        can lead to higher profits and shared success.
        <br><br>
        7. Investing Wisely:
        <br>
        Once you've accumulated a substantial amount of Zeny, consider investing it wisely to
        generate passive income. Explore opportunities such as vending, rental services, or investing
        in rare items with long-term value appreciation potential. Diversify your investments and
        monitor your returns to ensure sustainable growth over time.
        <br><br>
        8. Continuous Learning and Adaptation:
        <br>
        The world of Ragnarok Online is ever-evolving, and so too are the strategies for Zeny farming.
        Stay informed about game updates, patches, and new content that may affect the Zeny economy.
        Continuously refine your farming techniques, adapt to changing market conditions, and embrace
        innovation to maintain your competitive edge.
        <br><br>
        9. Locations for Zeny Farming:
        <br>
        a. Payon Cave: This dungeon is a classic spot for Zeny farming, especially for low to mid-level
        players. Hunt monsters such as Skeletons, Zombies, and Poporings for valuable drops like
        Skull Rings, Sticky Mucus, and Fabric. Additionally, the chance to encounter MVPs like Elder
        Willow can yield rare and lucrative loot.
        <br><br>
        b. Pyramids Dungeon: Explore the depths of the Pyramids for a chance to farm valuable
        treasures from monsters like Mummies, Minorous, and Verit. Look out for cards such as Mummy
        Card and Minorous Card, which can fetch high prices in the marketplace.
        <br><br>
        c. Clock Tower Basement: Venture into the Clock Tower Basement to face off against aggressive
        monsters like Clocks, Alarm, and Cruisers. Farming here can yield valuable drops such as Clock
        Hands, Alarm Cards, and Oridecon, which are in demand for crafting and upgrading equipment.
        <br><br>
        d. Toy Factory: Dive into the Toy Factory dungeon to farm Zeny from monsters like Myst Cases,
        Cruiser, and Teddy Bears. These monsters drop valuable items like Gift Boxes, Clock Hands, and
        Old Blue Boxes, which can be sold for a tidy profit.
        <br><br>
        10. Jobs for Zeny Farming:
        <br>
        a. Merchant/Blacksmith: Merchants and Blacksmiths excel at Zeny farming through crafting and vending.
        Utilize skills like Discount and Overcharge to maximize profits when buying and selling items.
        Additionally, Blacksmiths can farm materials from monsters and craft high-demand equipment like
        weapons and armors for sale.
        <br><br>
        b. Alchemist: Alchemists are adept at brewing potions, and creating consumables. Farming materials
        from monsters and converting them into valuable potions such as White Potions, Blue Potions,
        and Condensed Potions can be a lucrative venture.
        <br><br>
        c. Hunter/Sniper: Hunters and Snipers are proficient in hunting monsters for valuable loot
        and rare cards. Utilize skills like Beast Bane and Improve Concentration to increase damage
        output and efficiency when farming monsters. Focus on hunting high-value monsters and MVPs for
        rare drops and card collection.
        <br><br>
        d. Assassin Cross: Assassins are agile and deadly assassins capable of farming Zeny through
        looting and MVP hunting. Utilize skills like Enchant Deadly Poison and Grimtooth to dispatch
        monsters quickly and efficiently. Focus on farming high-value items and MVP drops for maximum profit.
        <br><br>
        By leveraging these locations and job classes effectively, you can optimize your Zeny farming efforts
        and achieve financial success in the world of Ragnarok Online. Experiment with different
        strategies, hone your skills, and watch your wealth grow as you embark on your journey to become
        a Zeny tycoon. Armed with the knowledge and strategies outlined in this guide, you are now ready to
        embark on your journey to Zeny riches. May your pockets be ever full, and your adventures in Midgard
        be prosperous!
        <br><br>
        Happy farming, adventurers!
              `,
        replies: [replies[6]._id, replies[7]._id],
        views: 75
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Frozen Ragnarok Online (HighRate)", 
        poster: users[9]._id,
        createdAt: new Date("Feb 01, 2024, 03:15 PM"),
        content: `
        Frozen Ragnarok Online
        <br><br>
        Pre-Renewal
        <br>
        3rd Job Server
        <br>
        Instant Level
        <br>
        Hunt Server
        <br>
        Easy Quest
        <br>
        2x Monster
        <br><br><br>
        Server Information:
        <br>
        Base: 8000x
        <br>
        Job:  8000x
        <br>
        BaseLevel: 255
        <br>
        JobLevel: 120
        <br>
        Stats: 150
        <br>
        ASPD: 195
        <br><br><br>
        Drop Rate:
        <br>
        Common: 100%
        <br>
        Equipment: 80%
        <br>
        Normal Card: 60%
        <br>
        MVP Card: 20%
        <br><br><br>
        Respawn rate:
        <br>
        Normal Monster: 100%
        <br>
        MVP Monster: 10%
        <br><br><br>
        Disable:
        <br>
        100% ATK & -100% ATK on Gospel
        <br>
        100% MATK on MindBreaker
        <br>
        Thanatos Card
        <br><br><br>
        Freebies:
        <br>
        3x Free Custom Headgear of ur Choice
        <br>
        2x Free Valkyrie Set
        <br>
        2x Free Deviling Card
        <br>
        2x Free Deviling Card
        <br>
        2x Free Tao Gunka Card
        <br>
        2x Free Ghostring Card
        <br>
        2x Free Moonlight Flower Card
        <br>
        2x Free Doppelganger Card
        <br>
        4x Free Turtle General Card
        <br><br>
        JOIN US NOW!!!!
              `,
        replies: [replies[8]._id],
        views: 25
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Assassin Cross vs Sniper, which is better for PvP?", 
        poster: users[7]._id,
        createdAt: new Date("Feb 01, 2024, 05:45 PM"),
        content: `
        What is your opinion on this topic? i am personally biased towards sinx as that is my favorite job but I want to hear other's opinions
              `,
        replies: [replies[9]._id, replies[10]._id, replies[11]._id],
        views: 74
    },  

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Ragnarok Mobile vs. Ragnarok Online - Thoughts?", 
        poster: users[8]._id,
        createdAt: new Date("Feb 02, 2024, 09:00 AM"),
        content: `
        Greetings, adventurers of Midgard!
        <br><br>
        Today, let's dive into a topic that sparks lively debates among the Ragnarok community: Ragnarok Mobile
        versus Ragnarok Online. With the rise of Ragnarok Mobile and its growing popularity, many players
        find themselves torn between the classic PC experience of Ragnarok Online and the convenience of
        mobile gaming. Let's explore the differences and share our thoughts on these two iterations of the
        beloved MMORPG.
        <br><br>
        1. Gameplay Experience:
        Ragnarok Online, with its nostalgic 2D graphics and point-and-click mechanics, offers a classic
        MMORPG experience that many players grew up with. On the other hand, Ragnarok Mobile boasts modern
        3D graphics, streamlined controls, and optimized gameplay for mobile devices. Which gameplay style
        do you prefer, and why? Do you enjoy the simplicity of Ragnarok Mobile's interface, or do you miss
        the complexity of Ragnarok Online's mechanics?
        <br><br>
        2. Community and Social Interaction:
        One of the hallmarks of Ragnarok Online is its vibrant community and social interaction.
        From joining guilds to participating in WoE (War of Emperium) battles, RO fostered a sense
        of camaraderie among players. How does the community aspect compare between Ragnarok Mobile
        and Ragnarok Online? Do you find it easier to connect with other players in one version over
        the other? Share your experiences of forming friendships, alliances, and rivalries in both games.
        <br><br>
        3. Content and Updates:
        Both Ragnarok Mobile and Ragnarok Online receive regular updates and new content to keep
        players engaged. Ragnarok Mobile introduces exclusive features such as the Pet System,
        Multi-Job System, and Endless Tower, while Ragnarok Online continues to expand its world with
        new maps, dungeons, and quests. Which game do you think offers a more satisfying content
        update cycle? Are there any features from one version that you wish were implemented in the other?
        <br><br>
        4. Accessibility and Convenience:
        One of the biggest advantages of Ragnarok Mobile is its accessibility. With the ability to
        play on-the-go from your mobile device, Ragnarok Mobile allows players to immerse themselves
        in the world of Midgard anytime, anywhere. However, some players argue that Ragnarok Online's
        PC-based platform offers a more immersive and customizable gaming experience. How do you balance
        the convenience of mobile gaming with the depth of PC gaming? Do you find yourself favoring one
        version over the other based on your gaming preferences and lifestyle?
        <br><br>
        5. Nostalgia vs. Innovation:
        For many players, Ragnarok Online holds a special place in their hearts as a nostalgic journey
        into their gaming past. However, Ragnarok Mobile brings a fresh perspective to the franchise
        with its innovative features and modern design. How do you reconcile your fond memories of
        Ragnarok Online with the new experiences offered by Ragnarok Mobile? Do you think one version
        does a better job of capturing the essence of Ragnarok's world and gameplay?
        <br><br>
        Share your thoughts, experiences, and opinions on the ongoing debate between Ragnarok Mobile and
        Ragnarok Online. Whether you're a die-hard fan of the classic PC version or a mobile gamer
        embracing the future of Ragnarok, your voice matters in shaping the future of our beloved MMORPG.
        <br><br>
        Let the discussion begin!
              `,
        replies: [replies[12]._id],
        views: 55
    },


    {   
        _id: new mongoose.Types.ObjectId(),
        title: "HiraniRO 5x5x5x", 
        poster: users[10]._id,
        createdAt: new Date("Feb 02, 2024, 07:20 PM"),
        content: `
        Do you miss the Golden Times of Ragnarok? What about a pre-renewal balanced server for whatever do
        you like to do most? Here you may find cool stuff trough MvP Points, Event Points, Mission Points,
        Bring the Items Quests or Cash Points (also obtained by voting), you choose for which way do you
        want to go!
        <br><br><br>
        What do you like do to most?
        <br>
        Party Play - You can pick party quests for killing a good amount of monsters in certain map
        (you choose!), at the end you and your party will get some extra EXP and an item reward! You
        may also find specific achievements for killing monsters, those also count for your party
        (since they are with you)! No more abandoned support classes, now your presence counts!
        <br><br>
        Solo Play - Like the party quests you can also pick solo quests, but you may find easier monsters
        for hunt, less monsters needed to complete que quest and more spot options! At the end of the
        hunting you may also get an extra EXP and an item reward depending on the selected monster.
        You may conquer different medals in achievements for killing large groups of monsters!
        <br><br>
        Guild Play - If you bring your guild to join us you will get a cool guild pack, even if it's a
        small friends' guild (4 or more player counts)!
        <br><br>
        MvP Hunt - To each MvP killed you will get MvP Points, that can be traded later for some
        nice stuff in the MvP Token Shop! Some *Bring the Items* quests require MvP items,
        those are for high level headgears. Get special MvP hunting achievements!
        <br><br>
        Role Playing - You can experience our unique quests for headgears - don't require high
        level characters -, daily EXP - simple quests for daily EXP reward, no need to go hunt lots
        of monsters! -, custom mining system - a nice story-line for you to follow and things to do
        before mastering your skills -, explorer achievements - explore the Ragnarok world, complete
        quests and get special achievements - and more!
        <br><br>
        Guild Wars - If you like the traditional War of Emperium, for sure you should try our
        Faction system: Meet new people in your faction, elect your faction leader, kill other faction
        members, win faction wars! You can choose between 4 factions: Aeronauts (Yuno), Hermits (Payon),
        Marauders (Morocc) and Pirates (Alberta). After entering a faction you get access to an
        exclusive #faction channel (each one have its own channel), some management commands
        (like @factionannounce), members have different colored auras and speak in different colors
        at the regular chat, some bonus stats, nice discount buying items from NPCs in your faction
        hometown and access to an extra dungeon and specific mobs!
        <br><br>
        HiraniRO Special Features:
        <br>
        => Special Master Login System + Master Storage
        <br>
        Share your items over all your ingame accounts using @masterstorage (general storage) instead
        of @storage (account storage).
        <br>
        When voting choose to which account do you want to redeem your Cash Points.
        <br>
        Your forum account is your master account! Store up to 10 game accounts there!
        <br>
        Type your password once at the patcher and have access to all your accounts.
        <br>
        => Open Faction VS Faction on every MAP (you may choose between joining a faction or not)
        <br>
        => New Novie Ground with First class Change for Free + Starter Pack of Items
        <br><br><br><br>
        Server Features Full List:
        <br><br>
        - Rates: 5x/5x/5x (Boss Monster Drop Rate 1x & Boss Monster Card Drop rate 1x)
        <br>
        - Rates: Achievements 5x    Quests 5x
        <br>
        - Pre-Renewal; No 3rd Classes
        <br>
        - Ragnarok Episode 13.2
        <br>
        - Max Level: 99/70
        <br>
        - Max Stats: 99
        <br>
        - Max ASDP: 190
        <br>
        - Party Share Range: 20 (25% bonus for each party member)
        <br><br>
        Commands:
        - @showpoints  @at @afk @autoloot @mobs @whosell @alootid @autoloottype @changegm
        <br>
        - @request @identifyall @refresh @breakguild @storage @gstorage @channel @home(Faction Only)
        @Vote(Faction Only)
        <br>
        - @set @rgm @time @masterstorage @go main @factionannounce
        <br>
        - @buy @sell ( Can only be used in  Towns)
        <br><br>
        New Novice Ground with First class Change for Free + Starter Pack of Items
        <br>
        Guild Package for more than 4+ Players
        <br>
        Faction System
        <br>
        VIP System
        <br>
        Fishing System
        <br>
        Single Quest System
        <br>
        Party Quest System
        <br>
        Achievement System
        <br>
        Custom Main Town
        <br>
        Multilanguage System
        <br>
        Town Warper
        <br>
        Dungeon Warper
        (Some maps have a Dungeon Access Quest, and you can only warp there once you complete the quest)
        <br>
        Giant Butterfly Wing (Recalls the whole Party to the Party Leader. If the map has an access
        quest only party members who have finished the quest will be warped)
        <br>
        Stylist (KamiShi's colorful palettes)
        <br>
        Stat/Skill Reset NPC / Build Saver
        <br>
        Card Remover
        <br>
        Hunting Quests
        <br>
        Daily Quests System
        <br>
        Many Custom Maps
        <br>
        Battlegrounds 2.0
        <br>
        War of Emperium FE
        <br>
        Headgear Quests
        <br>
        Instances/Party Dungeons
        <br>
        Automated Events
        <br>
        Vote for points system (Vote Points will auto convert into Cash Shop Points)
        <br>
        Custom PvP Arena with PvP Ladder
        <br>
        No overpowered custom items
        <br>
        Event Points Shop
        <br>
        Achievement Point Shop
        <br>
        Special Elemental Race System
        <br>
        MVP Token System ( You obtain them from MVP kills and can trade them in for some MVP Equipments )
        <br>
        Anti-WPE and speed hack prevented server side to avoid such exploits of the game.
              `,
        replies: [replies[13]._id],
        views: 32
    },
]

users[0].posts = [posts[1]._id, posts[5]._id, posts[6]._id];
users[1].posts = [posts[2]._id];
users[2].posts = [posts[0]._id];
users[3].posts = [posts[3]._id];
users[4].posts = [];
users[5].posts = [posts[4]._id];
users[6].posts = [posts[7]._id];
users[7].posts = [posts[9]._id];
users[8].posts = [posts[10]._id];
users[9].posts = [posts[8]._id];
users[10].posts = [posts[11]._id];

if (!users[0].upvoted) {
    users[0].upvoted = [];
  }

users[0].upvoted.push(
    { itemType: 'Post', item: posts[0]._id },
    { itemType: 'Reply', item: replies[0]._id }
  );
    
if (!users[0].downvoted) {
    users[0].downvoted = [];
}

users[0].downvoted.push(
    { itemType: 'Post', item: posts[1]._id },
    { itemType: 'Reply', item: replies[1]._id }
  );

posts[0].upvotes = 1;
replies[0].upvotes = 1;
posts[1].upvotes = -1;
replies[1].upvotes = -1;

users[0].replies = [];
users[1].replies = [];
users[2].replies = [];
users[3].replies = [];
users[4].replies = [replies[0]._id, replies[2]._id, replies[5]._id, replies[6]._id, replies[8]._id, replies[10]._id];
users[5].replies = [replies[1]._id, replies[3]._id, replies[7]._id, replies[9]._id];
users[6].replies = [replies[4]._id, replies[11]._id];
users[7].replies = [replies[12]._id, replies[13]._id];
users[8].replies = [];
users[9].replies = [];
users[10].replies = [];

replies[0].refPost = posts[3]._id;
replies[1].refPost = posts[3]._id;
replies[2].refPost = posts[4]._id;
replies[3].refPost = posts[4]._id;
replies[4].refPost = posts[4]._id;
replies[5].refPost = posts[6]._id;
replies[6].refPost = posts[7]._id;
replies[7].refPost = posts[7]._id;
replies[8].refPost = posts[8]._id;
replies[9].refPost = posts[9]._id;
replies[10].refPost = posts[9]._id;
replies[11].refPost = posts[9]._id;
replies[12].refPost = posts[10]._id;
replies[13].refPost = posts[11]._id;

boards = [
    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Forum FAQs & Announcements", 
        description: "For topics related to the forum.",
        innerDescription: "Stay up-to-date with the latest forum guidelines and announcements!",
        posts: [posts[0]._id, posts[1]._id, posts[2]._id, posts[6]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Forum Feedback & Suggestions",
        description: "Share your ideas and help shape a better forum experience!",
        innerDescription: "State your feedback and suggestion for the forum here!",
        posts: [posts[3]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Rant Zone", 
        description: "Unleash your frustrations in a supportive community environment.",
        innerDescription: "Unleash the fire in you and rant your heart out in the Rant Zone!",
        posts: [posts[4]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "High Rates", 
        description: "Dive into the fast-paced world of high-rate Ragnarok servers.",
        innerDescription: "Give a review to your favorite High-Rate Server!",
        posts: [posts[8]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Low Rates", 
        description: "Delve into the immersive realm of low-rate Ragnarok servers.",
        innerDescription: "Give a review to your favorite Low-Rate Server!",
        posts: [posts[11]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "General Discussion", 
        description: "Engage in lively discussions, share tips, and explore the mysteries of Rune Midgard!",
        innerDescription: "Have a discussion about the fine world of the Rune Midgard Kingdom!",
        posts: [posts[10]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "Job Discussion", 
        description: "Delve into the specifics of the different Ragnarok Online jobs.",
        innerDescription: "Discuss the many different jobs in Ragnarok Online!",
        posts: [posts[5]._id, posts[9]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {   
        _id: new mongoose.Types.ObjectId(),
        title: "General Guides", 
        description: "Contribute, showcase your expertise, or guide newcomers!",
        innerDescription: "Share your knowledge or indulge in the knowings of Veterans in Ragnarok Online!",
        posts: [posts[7]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },
]


posts[0].refBoard = boards[0]._id;
posts[1].refBoard = boards[0]._id;
posts[2].refBoard = boards[0]._id;
posts[3].refBoard = boards[1]._id;
posts[4].refBoard = boards[2]._id;
posts[5].refBoard = boards[6]._id;
posts[6].refBoard = boards[0]._id;
posts[7].refBoard = boards[7]._id;
posts[8].refBoard = boards[3]._id;
posts[9].refBoard = boards[6]._id;
posts[10].refBoard = boards[5]._id;
posts[11].refBoard = boards[4]._id;

categories = [
    {
        _id: new mongoose.Types.ObjectId(),
        title: "NexusHub Community",
        boards: [boards[0]._id, boards[1]._id, boards[2]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Server Reviews",
        boards: [boards[3]._id, boards[4]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Ragnarok Online",
        boards: [boards[5]._id, boards[6]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        title: "Guides",
        boards: [boards[7]._id],
        createdAt: new Date("Jan 19, 2024, 12:00 AM"),
    },
]

boards[0].category = categories[0]._id;
boards[1].category = categories[0]._id;
boards[2].category = categories[0]._id;
boards[3].category = categories[1]._id;
boards[4].category = categories[1]._id;
boards[5].category = categories[2]._id;
boards[6].category = categories[2]._id;
boards[7].category = categories[3]._id;

replies.forEach(reply => {
    reply.updatedAt = reply.createdAt;
});

posts.forEach(post => {
    post.updatedAt = post.createdAt;
});

boards.forEach(board => {
    board.updatedAt = board.createdAt;
});

categories.forEach(category => {
    category.updatedAt = category.createdAt;
});

reports = [
    {
        _id: new mongoose.Types.ObjectId(),
        reporter: users[4]._id,
        reportedItem: {
            itemType: "Post",
            item: posts[9]._id
        },
        reason: "Disrespectful Behavior",
        description: "Very disrespectful",
        createdAt: new Date("Mar 04, 2024, 4:33 PM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        reporter: users[0]._id,
        reportedItem: {
            itemType: "Reply",
            item: replies[1]._id
        },
        reason: "Multiple Accounts",
        description: "I think he is multi accounting",
        createdAt: new Date("Mar 04, 2024, 4:34 PM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        reporter: users[0]._id,
        reportedItem: {
            itemType: "Reply",
            item: replies[0]._id
        },
        reason: "Other",
        description: "I think he looks like an idiot",
        createdAt: new Date("Mar 04, 2024, 4:35 PM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        reporter: users[0]._id,
        reportedItem: {
            itemType: "Reply",
            item: replies[11]._id
        },
        reason: "Spam or Self-Promotion",
        description: "He is trying to self promote",
        createdAt: new Date("Mar 04, 2024, 4:36 PM"),
    },

    {
        _id: new mongoose.Types.ObjectId(),
        reporter: users[0]._id,
        reportedItem: {
            itemType: "Post",
            item: posts[3]._id
        },
        reason: "Illegal Activities",
        description: "He is an illegal logger",
        createdAt: new Date("Mar 04, 2024, 4:37 PM"),
    },
]


module.exports = {
    users,
    posts,
    replies,
    boards,
    categories,
    reports
};