addLayer("Ktr", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol(){return "Ktr<sup>"+player.Ktr.storyUnlocked}, // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        memory: new Decimal(0),
        stallar: new Decimal(0),
        stallarFreeze: new Decimal(0),
        ark: new Decimal(0),
        fuel: new Decimal(0),
        totalFuel: new Decimal(0),
        storyUnlocked: 0,
        storyShowing: 1,
        newStory: false,
        distant: false,
        remote: false,
        solarLayer: 0,
        solarPower: [n(0),n(0),n(0),n(0),n(0),n(0)],
        universalTime: n(0),
        realTime: n(0),
        timeWrap: n(1),
        memoryCrystal: n(0),
        gateLayer: 0,
        content: '',
        gate1: 0,
        lastCrystal: n(0),
        resetedMemory: false,
        respeced: false,
        posk1: 0,
        posk2: 0,
    }},
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone('Hkm','Hkm-2') && resettingLayer == 'Hkm') keep.push('upgrades')
        if (hasMilestone('Hkm','Hkm-7') && resettingLayer == 'Hkm') keep.push('memoryCrystal')
        if (hasMilestone('Hkm','Hkm-8') && resettingLayer == 'Hkm') keep.push('distant')
        if (hasMilestone('Hkm','Hkm-8') && resettingLayer == 'Hkm') keep.push('remote')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('buyables')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('ark')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('fuel')
        if (hasMilestone('Hkm','Hkm-12') && resettingLayer == 'Hkm') keep.push('totalFuel')
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },
    resetsNothing(){
        return player.Ktr.storyUnlocked >= 9
    },
    celestialLevel(){
        let level = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            level[i] = player.Ktr.solarPower[i].add(1).log(tmp.Ktr.celestialRoot[i]).floor()
        }
        if(level[0].gte(100)) level[0] = n(100)
        return level
    },
    arkReq(){
        return [0,200,10000,100000,2e6,1e8,1e10,4e12,4e15,4e17,4e20]
    },
    arkBonusReq(){
        return [2,3,4,5,6,7,8,14,22,31,99999]
    },
    arkFullReq(){
        if(player.Ktr.ark.lt(10)) req = n(tmp.Ktr.arkReq[player.Ktr.ark.add(1)])
        if(player.Ktr.ark.gte(10) && player.Ktr.ark.lt(20)) req = new Decimal(2500).pow(player.Ktr.ark.sub(10)).mul(1e19)
        if(player.Ktr.ark.gte(20) && player.Ktr.ark.lt(30)) req = new Decimal(2.5e6).pow(player.Ktr.ark.sub(19)).mul(1e48)
        if(player.Ktr.ark.gte(30) && player.Ktr.ark.lt(40)) req = new Decimal(7e9).pow(player.Ktr.ark.sub(29)).mul(1e110)
        if(player.Ktr.ark.gte(40) && player.Ktr.ark.lt(80)) req = new Decimal(1e25).pow(player.Ktr.ark.sub(39)).mul(1e210)
        if(player.Ktr.ark.gte(80)) req = new Decimal(1e55).pow(player.Ktr.ark.sub(79)).mul('1e1050')
        if(tmp.Ktr.celestialLevel[1].gte(1)) req = req.div(tmp.Ktr.clickables['Ktr-r-c2'].effect1)
        if(hasAchievement('Ain','Hkm-14')) req = req.div(buyableEffect('Hkm','Hkm-f1'))
        return n(req)
    },
    stallarEff(){
        let eff = player.Ktr.stallar.add(2.7).log(2.7)
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[5].start)) eff = eff.pow(4.5)
        if(hasUpgrade('Hkm','Hkm-8')) eff = player.Ktr.stallar.add(1).pow(0.05)
        return eff
    },
    solarLayer(){
        let layer = ["银河系","本地星际泡","室女座超星系团","可观测宇宙","多重宇宙"]
        return layer
    },
    solarReq(){
        return [1e52,5e67,1e150,1e9999]
    },
    solarBoost(){
        return [1,1000,1e6,1e18]
    },
    solarColor(){
        return ['lavender','#c999ff','#8619ff','#480099']
    },
    celestialGain(){
        return [tmp.Ktr.solarEnergy.root(5).div(10).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(10).div(1300).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(15).div(1e4).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(22).div(1e7).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(30).div(1e8).mul(tmp.Ktr.celestialBoost),tmp.Ktr.solarEnergy.root(40).div(1e12).mul(tmp.Ktr.celestialBoost)]
    },
    celestialRoot(){
        return [5,9,10,12,25,40]
    },
    celestialBoost(){
        let boost = n(1)
        if(player.Ktr.solarPower[0].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c1'].effect1)
        if(player.Ktr.solarPower[2].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c3'].effect1)
        if(player.Ktr.solarPower[4].gte(1)) boost = boost.mul(tmp.Ktr.clickables['Ktr-r-c5'].effect1)
        if(getBuyableAmount('Ktr','Ktr-s-d4').gte(1)) boost = boost.mul(buyableEffect('Ktr','Ktr-s-d4'))
        if(player.Ktr.ark.gte(30)) boost = boost.mul(5).mul(Decimal.pow(1.2,player.Ktr.ark.sub(30)))
        if(tmp.Ktr.memoryLevel.gte(75)) boost = boost.mul(10)
        return boost
    },
    celestialNext(){
        let next = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            next[i] = Decimal.pow(tmp.Ktr.celestialRoot[i],tmp.Ktr.celestialLevel[i].add(1)).sub(1)
        }
        return next
    },
    celestialProgress(){
        let progress = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            progress[i] = Decimal.div(player.Ktr.solarPower[i],tmp.Ktr.celestialNext[i]).mul(100)
        }
        return progress
    },
    celestialPerSec(){
        let persec = [n(0),n(0),n(0),n(0),n(0),n(0)]
        for (var i=0; i<=5; i++){
            persec[i] = Decimal.div(tmp.Ktr.celestialGain[i],tmp.Ktr.celestialNext[i]).mul(100)
        }
        return persec
    },
    solarEnergy(){
        let gain = player.Ktr.stallar.pow(0.05).mul(tmp.Ktr.solarBoost[player.Ktr.solarLayer])
        if(player.Ktr.solarPower[0].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c1'].effect1)
        if(player.Ktr.solarPower[2].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c3'].effect1)
        if(player.Ktr.solarPower[4].gte(1))gain = gain.mul(tmp.Ktr.clickables['Ktr-r-c5'].effect1)
        if(getBuyableAmount('Ktr','Ktr-s-d4').gte(1)) gain = gain.mul(buyableEffect('Ktr','Ktr-s-d4'))
        if(getBuyableAmount('Ktr','Ktr-s-d5').gte(1)) gain = gain.mul(buyableEffect('Ktr','Ktr-s-d5'))
        if(player.Ktr.ark.gte(30)) gain = gain.mul(5).mul(Decimal.pow(1.2,player.Ktr.ark.sub(30)))
        if(tmp.Ktr.memoryLevel.gte(42)) gain = gain.mul(100)
        if(tmp.Ktr.memoryLevel.gte(75)) gain = gain.mul(10)
        if(hasAchievement('Ain','Hkm-14')) gain = gain.mul(buyableEffect('Hkm','Hkm-f3'))
        return gain
    },
    solarEff(){
        let eff = tmp.Ktr.solarEnergy.add(1).pow(0.5)
        if(player.Ktr.storyUnlocked >= 9) eff = eff.mul(player.Ktr.memoryCrystal.add(1).pow(2))
        return eff
    },
    arkEff(){
        let eff = Decimal.pow(n(2).add(player.Ktr.ark.gte(5)? buyableEffect('Ktr','Ktr-s-d2'):0),Decimal.pow(player.Ktr.ark,1.2))
        if(player.Ktr.remote) eff = eff.mul(tmp.Ktr.solarEff)
        return eff
    },
    gateEff(){
        let power = n(0.05)
        power = power.mul(player.Ktr.realTime.add(1).log10().min(4))
        if(layers.Ktr.buyables['Ktr-g-h2'].enabled() && player.Ktr.storyUnlocked >= 9) power = power.add(0.05)
        if(layers.Ktr.buyables['Ktr-g-h3'].enabled() && player.Ktr.storyUnlocked >= 9) power = power.mul(2)
        return power
    },
    antimatter(){
        if(hasMilestone('Hkm','Hkm-6')) return n(0)
        let antimatter = Decimal.pow(2,player.Ktr.universalTime.sub(10)).sub(1).max(0)
        return antimatter
    },
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Kether 点数", // Name of prestige currency
    baseResource: "精华", // Name of resource prestige is based on
    baseAmount() {return player.points}, // 获得 the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    passiveGeneration(){return player.Ktr.ark.gte(2)? 1 : 0},
    ArkDescs: {
        2: "解锁红矮星，并获得一个额外褐矮星。",
        3: "获得0.2坤个红矮星，并且在重置时获取100%的Kether点。",
        4: "解锁橙矮星。",
        5: "获得0.2坤个红矮星。",
        6: "解锁黄矮星。",
        7: "每个褐矮星提供0.05个黄矮星。",
        8: "重置时保留褐、黄矮星。",
        14: "解锁白矮星。",
        22: "解锁一行新的遥远星空升级。方舟重置不再重置星体。",
        31: "极远星空中的所有资源获取变为5倍，并且这之后每个方舟再次提升1.2倍。",
        99999: "???",
    },
    memoryBonus:{
        0:{
            desc:'精华获取',
            effect(){return Decimal.pow(2,tmp.Ktr.memoryLevel)},
            start: n(1),
            prev: '×',
            color: "#FFFFFF"
        },
        1:{
            desc:'Kether点数获取',
            effect(){
                let eff = Decimal.pow(n(1.6).add(tmp.Ktr.memoryLevel.lt(45) && tmp.Ktr.memoryLevel.gte(15)? 0.2 : 0),tmp.Ktr.memoryLevel.sub(2))
                if(tmp.Ktr.memoryLevel.gte(15)) eff = eff.pow(2)
                if(eff.gte(1e12)) softcap(eff,'root',n(1e12),3)
                return eff
            },
            start: n(3),
            prev: '×',
            color: "#FFFFFF"
        },
        2:{
            desc:'Kether点数获取指数',
            effect(){return n(1.03)},
            start: n(7),
            prev: '^',
            color: "#FFFFFF"
        },
        3:{
            desc:'精华获取指数',
            effect(){return n(1.02)},
            start: n(15),
            prev: '^',
            color: "#FFFFFF"
        },
        4:{
            desc:'Ktr-3 效果',
            effect(){return n(4)},
            start: n(25),
            prev: '^',
            color: "lightyellow"
        },
        5:{
            desc:'恒星效果',
            effect(){return n(4.5)},
            start: n(50),
            prev: '^',
            color: "lightyellow"
        },
        6:{
            desc:'Ktr-s-d4 基础',
            effect(){return n(0.5)},
            start: n(65),
            prev: '+',
            color: "lavender"
        },
        7:{
            desc:'恒星效果',
            effect(){return n(4.5)},
            start: n(101),
            prev: '^',
            color: "lightyellow"
        },
    },
    storyContent: {
        1:{
            text(){ 
                let text = `<text style='color:#FFFFFF; font-size: 30px; text-shadow: 2px 2px 7px white'>My lifelong pursuit is the ultimate beauty of sensibility and the true knowledge of reason.</text><br>
	        	<text style='color:#FFFFFF; font-size: 30px; text-shadow: 2px 2px 7px white'>I want to stand at the highest point of the city and take another look at the Miracle Continent amidst the starry sky.
                I want to always remember its beautiful appearance.——Kether</text><br><br>
        		<text style='color: #999999'>[Illustration] In the year 680 of the lunar calendar, the Miracle Continent was destroyed. In order to change the fate of its destruction, Ain traveled to the Miracle Continent. Through repeated attempts and cycles, she have come to understand that her destiny is a constant repetition, but it can never change the fate of the Miracle Continent. In order to change this outcome, she pay the price of forgetting her predetermined destiny, summoning some of your consciousness into the spiritual world through the Heart Gate, rebuilding the order of the Kabalah Tree, and attempting to break the trajectory of her predetermined destiny—— Preface to Kabalah Incremental Tree</text><br>
		        <text style='color:magenta'>[Ain] Let me think again... I have traveled through time and space, back to the miraculous continent 680 years ago... I passed through a door, and there I met...</text><br>`
                if(player.Ktr.storyUnlocked < 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 1 kether point to continue.(Tips: Press the prestige button in the kether layer to gain Kether点数. You will lost all your essence 你拥有.)</i>`
                if(player.Ktr.storyUnlocked >= 1) text += `
                <text style='color:magenta'>[Ain] You are the person I met at the Heart Gate, and we are in a state of conscious connection. You can see what happens on the Miracle Continent.</text><br>
                <text style='color:magenta'>[Ain] Perhaps because we all come from the same world, we can...</text><br>`
                return text
            }
        },
        2:{
            text(){ 
                let text = `<text style='color:#999999'>[Illustration] The scene presented to Ain was a strange city.</text><br>
                <text style='color:magenta'>[Ain] Crown Town Hospital, where is this?</text><br>
                <text style='color:magenta'>[Ain] There is a clothing store ahead, let's go and inquire about the situation in this world first.</text><br>
                <text style='color:#999999'>[Illustration] For some reason, Ain's mind suddenly flashed with a scene of a sea of stars.</text><br>
                <text style='color:#999999'>[Illustration] In that moment, she remembered a dream she had had when she was a child.</text><br>
                <text style='color:#999999'>[Illustration] When she was six years old, she once dreamed of a sea of stars.</text><br>
                <text style='color:#999999'>[Illustration] There is a stargazing platform on the sea, and a silent writer between the starry seas.</text><br>
                <text style='color:#999999'>[Illustration] The hood blocked his eyes, and he reached out his pen, pointing towards the starry sky. The stars seemed to be manipulated by him, moving out of their brilliant orbits.</text><br>
                <text style='color:white'>[Kether] This is the only answer, all galaxies are destined to be destroyed.</text><br>`
                if(player.Ktr.storyUnlocked == 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Have at least 1 kether upgrade to continue. "Upgrade" is a tool can be bought by using Kether点数, and boost your game production. It can only be bought once to become effective.</i>`
                if(player.Ktr.storyUnlocked >= 2) text += `
                <text style='color:#999999'>[Illustration] He doesn't seem to be talking to anyone, focusing on describing the picture in his heart.</text><br>
                <text style='color:white'>[Kether] I observed the only outcome, but left behind a small unpredictable factor. Will the outcome change as a result?</text><br>
                <text style='color:magenta'>[Ain lv.6] Who are you?</text><br>
                <text style='color:white'>[Kether] It is the person who endows you with destiny.</text><br>
                <text style='color:#999999'>[Illustration] For some reason, the memories in this dream suddenly became particularly clear.</text><br>
                <text style='color:#999999'>[Illustration] Ain had not yet recovered from his previous mood when many people suddenly entered the clothing store.</text><br>
                <text style='color:#999999'>[Illustration] But they were not shopping, they were directly surrounding Ain.</text><br>
                <text style='color:white'>[Kether-9718] This guest, you are...</text><br>
                <text style='color:white'>[Kether-19] The girl with long hair, is you? You looks so featureless... Of course, the one who possesses the power of Saphirah's Shadow.</text><br>
                <text style='color:#999999'>[Illustration] The door of the clothing store was closed, with two people standing at the entrance, not allowing anyone to enter.</text><br>
                <text style='color:#999999'>[Illustration] The sexy girl be numbered as Kether-19 is coming towards the power of Saphirah's shadow.</text><br>`
                return text
            }
        },
        3:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] I think you may have misunderstood something, I don't have this power.</text><br>
                <text style='color:white'>[Kether-19] Do 你拥有 it or not? Let's give it a try and we'll know!</text><br>
                <text style='color:#999999'>[Illustration] Kether-19 suddenly pulled Ain into [Battle of Recollection]!!</text><br>
                <text style='color:#999999'>[Illustration] This time, Ain felt a different state of mind than before, a deeper power was awakened, and a strange voice appeared in her heart.</text><br>
                <text style='color:white'>[Kether] What should you, who has lost your memory, use to fight?</text><br>`
                if(player.Ktr.storyUnlocked == 2) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 200,000 essences to continue.(No exaggeration, it is indeed 200 thousand) This may require much stronger upgrade effect.</i>`
                if(player.Ktr.storyUnlocked >= 3) text += `
                <text style='color:#999999'>[Illustration] The scene in front of Ain quickly twisted, and Ain found herself appearing among a sea of stars. Ain looked around in confusion, feeling so familiar.</text><br>
                <text style='color:magenta'>[Ain] Where is there?</text><br>
                <text style='color:white'>[Kether] Your mental world, the real battlefield of recollection battle.</text><br>
                <text style='color:white'>[Kether] The true battle of recollection is a competition between memories and emotions placed on essence, and the power of memories from within can influence the outcome of the battle. I am just a memory projection, not your teacher. Now, do you remember? The true power hidden in memory is the key to changing the battlefield.</text><br>
                <text style='color:#999999'>[Illustration] Ain returned to the Battle of Recollection, relying on his powerful memory to defeat the woman. After the Battle of Recollection, the starry sea dissipated and everything returned to tranquility, but the memories hidden in Ain's heart gradually became clear.</text><br>
                <text style='color:white'>[Kether-9718] The powerful power of memory can change a person's spiritual world, can we say Has Kether-19's spiritual world been altered? Is the rumor true?</text><br>
                <text style='color:#999999'>[Illustration] Ain murmured to herself, everything that was once beautiful will disappear into thin air, and civilization is like it has never existed before, leaving no trace. All of this is because...</text><br>
                <text style='color:#999999'>[Illustration] "The story of the Miracle Continent should come to an end." Kether stood in the distance, her silver hair stirred by the wind of the apocalypse, making the final judgment for the destruction of the Miracle Continent.</text><br>`
                return text
            }
        },
        4:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] No, this is not true. The Miracle Continent has been destroyed I actually witnessed its destruction with my own eyes.</text><br>`
                if(player.Ktr.storyUnlocked == 3) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 200 恒星点数 to continue. Create a giant gas planet to start collecting it.</i>`
                if(player.Ktr.storyUnlocked >= 4) text += `
                <text style='color:white'>[Kether] This world is plunged into conflict and chaos, and on a memory level, everyone is endowed with the ability to change the memories of others. Your desires are hidden in your heart, your dreams seem so unattainable, all because of your weakness. Come on, let me give you the power to change the situation.</text><br>
                <text style='color:#999999'>[Illustration] Ain's mind flashed with many memories, unwilling to lose more, unable to face fate anymore, and unwilling to accept the predetermined outcome!</text><br>
                <text style='color:#999999'>[Illustration] Kether's stargazing platform was parked in front of Ain, and the seawater seemed to follow Kether's guidance and surge up, blocking the sunlight from the sky.</text><br>
                <text style='color:magenta'>[Ain] It's you, Kether.</text><br>
                <text style='color:white'>[Kether] I told you before that Sephirah's Shadow is just a memory projection.</text><br>
                <text style='color:magenta'>[Ain] Sephirah's Shadow?</text><br>
                <text style='color:white'>[Kether] I exist based on your soul, I am just a memory drifting in an endless ocean of memories.</text><br>
                <text style='color:magenta'>[Ain] Why you selected me?</text><br>
                <text style='color:white'>[Kether] Fate has chosen you, I am just an observer of fate.</text><br>
                <text style='color:magenta'>[Ain] The observer of fate? It is you who manipulated the fate of the Miracle Continent, leading it towards destruction!</text><br>
                <text style='color:white'>[Kether] Why do you consider as that?</text><br>
                <text style='color:magenta'>[Ain] I saw it with my own eyes!</text><br>
                <text style='color:white'>[Kether] What you see is not true, go and search for the answer you want in my memory.</text><br>`
                if(player.Ktr.storyUnlocked == 4) text += `<br><br>
                <i style='color: #444444'>[Locked] Build 3 方舟 to continue. Everytime you build a ark you will lost all stars as well as 恒星点数.</i>`
                if(player.Ktr.storyUnlocked >= 5) text += `
                <text style='color:white'>[Kether] Are you saying that my calculation is incorrect?</text><br>
                <text style='color:magenta'>[Ain] I will not question your calculations. I am the insignificance in your mouth, and I cannot see the truth you speak in this starry sky; I am the stupidity in your mouth, and I will never compromise until the destruction is complete.</text><br>`
                return text
            }
        },
        5:{
            text(){ 
                let text = `<text style='color:magenta'>[Ain] You see all living beings as ants, and the joy of each day and the anticipation for tomorrow are short-lived things that all living beings will cherish.</text><br>
                <text style='color:white'>[Kether] But no matter what, destruction will eventually come.</text><br>
                <text style='color:magenta'>[Ain] I will go and change the future 你拥有 written about!</text><br>
                <text style='color:#999999'>[Illustration] On the distant skyline, white appears, and the rising stars rise high.</text><br>
                <text style='color:magenta'>[Ain] This is the fate 你拥有 chosen for me. You want me to break it, don't you? Teacher, thank you for telling me this. I'm leaving now.</text><br>
                <text style='color:white'>[Kether] In this era, you are like a gravel thrown into boundless seawater. I can't see whether you will stir up a vortex or be silently swallowed up.</text><br>
                <text style='color:#999999'>[Illustration] The ocean and the stars fade away, interweaving into Ain's clothes. Shake off the stars, clothes designed by Kether.</text><br>
                <text style='color:white'>[Kether] Use its power to leave the starry sea.</text><br>
                <text style='color:#999999'>[Illustration] The stars shake off, the tide fades, and the first ray of morning sunlight shines on Ain's sleeping face. Eyelashes twitched slightly, and Ain opened his eyes.</text><br>
                <text style='color:#999999'>[Illustration] In the world of starry seas, the stargazing platform is still floating, and the starry seas have not disappeared, but Ain cannot see this scene anymore.</text><br>
                <text style='color:white'>[Kether] The orbits of stars are independent of each other, and the appearance of interlocking is just an illusion of a certain angle. Each orbit is the fate of a world.</text><br>
                <text style='color:white'>[Kether] Are you looking for her? She has already returned to the real world.</text><br>`
                if(player.Ktr.storyUnlocked == 5) text += `<br><br>
                <i style='color: #444444'>[Locked] Let the ark reach the distant space to continue. Maybe you need more 方舟燃料.</i>`
                if(player.Ktr.storyUnlocked >= 6) text += `
                <text style='color:#999999'>[Illustration] Kether seems to be talking to herself, but you think this man can feel your presence.</text><br>
                <text style='color:pink'>[You] Are you saying to me?</text><br>
                <text style='color:#999999'>[Illustration] Kether didn't answer you. He put down his pen and countless star tracks slid behind him, silently falling onto the sea of stars.</text><br>
                <text style='color:white'>[Kether] I chose her, she will be the unknown of fate, perhaps able to break the predetermined fate of the Miracle Continent. She chose you to break her destiny. But in order to establish a connection with the Heart Gate, she paid the price and forgot what her fate was.</text><br>`
                return text
            }
        },
        6:{
            text(){ 
                let text = `<text style='color:pink'>[You] What is Ain's fate?</text><br>
                <text style='color:white'>[Kether] No matter how many attempts, no matter the cost, nothing can be changed. This is her fate, but she chose you.</text><br>
                <text style='color:#999999'>[Illustration] Kether reached out her hand as if touching an invisible "wall", causing ripples to form on the wall. Silver white borders gradually appeared around the wall, interspersed with crystals like stars. It was a mirror, and Kether was inside the mirror.</text><br>
                <text style='color:pink'>[You] 你拥有n't told me yet, how can I leave here?</text><br>
                <text style='color:white'>[Kether] Through the mirror, your consciousness can reconnect with her spiritual world.</text><br>
                <text style='color:#999999'>[Illustration] Kether disappeared from the mirror, and the world in the mirror also changed. The sky and ocean still existed, and the stars gradually dimmed until they disappeared.</text><br>
                <text style='color:pink'>[You] Is it me in the mirror, or am I seeing the mirror?</text><br>
                <text style='color:white'>[Kether] Why not have a try?</text><br>
                <text style='color:#999999'>[Illustration] You walked through the mirror, and a brand new world appeared before my eyes.</text><br>`
                if(player.Ktr.storyUnlocked == 6) text += `<br><br>
                <i style='color: #444444'>[Locked] Let the ark reach the remote space to continue. Maybe you need more 恒星点数.</i>`
                if(player.Ktr.storyUnlocked >= 7) text += `
                <text style='color:#999999'>[Illustration] On the vast and calm sea surface, various magical buildings float: a serene garden, a museum like building, and a clock tower with dials and clocks separated. The tracks of a train connect these buildings like chains.</text><br>
                <text style='color:pink'>[You] Is this what Kether called the ark that carries all the memories of civilization? What's going on? Aren't we in a world of stars? After waking up from that dream in the starry sea, everything returned to normal. I wanted to know what connection Saphirah's Shadow had with Kether, so I went back to the ark first.</text><br>
                <text style='color:magenta'>[Ain] I forgot that 你拥有n't come here yet. This is the sea of memories in the distant and deep sky, the ocean of human memory, connecting different worlds and consciousness. The Ark manages the Sea of Memory, and after the destruction of the Miracle Continent, I came to the Ark. By relying on the ark, I can cross back and thus connect with your consciousness.</text><br>
                <text style='color:white'>[Kether-7] Ain? Fallen_ Cat? You all have returned!</text><br>
                <text style='color:white'>[Kether-7] Wow, Fallen_ Cat, you are still so soft~</text><br>`
                return text
            }
        },
        7:{
            text(){ 
                let text = `<text style='color:#999999'>[Illustration] The little girl hugged you tightly and refused to let go. You are struggling hard.</text><br>
                <text style='color:pink'>[You] Well, Ain, introduce her?</text><br>`
                if(player.Ktr.storyUnlocked == 7) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 all distant space upgrade to continue. That means getting at least 21 方舟.</i>`
                if(player.Ktr.storyUnlocked >= 8) text += `
                <text style='color:magenta'>[Ain] Ktr-7, one of the ark administrators, also has an administrator named Ktr-2, who is Ktr-7's brother. The numbers represent the strength ranking of their Saphirah Shadow power in the Kether field.</text><br>
                <text style='color:#999999'>[Illustration] At this moment, a powerful palm lifted the Ktr-7 and it struggled vigorously in the air.</text><br>
                <text style='color:white'>[Kether-2] Don't cause trouble, Ktr-7.</text><br>
                <text style='color:white'>[Kether-7] I didn't cause any trouble! Let me down, brother!</text><br>
                <text style='color:#999999'>[Illustration] You observed the man behind Ktr-7 and it seemed that he was Ktr-7's brother, another administrator of the ark, Ktr-2.</text><br>
                <text style='color:white'>[Kether-2] Ain, I just took you to the Sephirah Shadow Museum, where all Sephirah shadows are stored in a mirror. The power you used in the battle before was the Sephirah Shadow, it seems that you can summon the Sephirah Shadow.</text><br>`
                if(player.Ktr.storyUnlocked == 8) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 The Kether's Heart Gate to unlock. This is the ultimate challenge of Kether layer.</i>`
                if(player.Ktr.storyUnlocked >= 9) text += `
                <text style='color:white'>[Kether-2] I have found some new clues about Kether, and I will let you know once I have sorted them out.</text><br>
                <text style='color:magenta'>[Ain] Thank you, Ktr-2.</text><br>
                <text style='color:white'>[Kether-2] It's okay, I was already looking for something about Kether.</text><br>
                <text style='color:#999999'>[Illustration] Ain had no intention of staying in the ark anymore and decided to leave with you first. Kether-2 then took Ain and you to the Heart Gate to return. The gate of the heart is located in the center of the ark, and the core of the ark's operation, the "Ark's Heart," is located below the gate of the heart.</text><br>
                <text style='color:white'>[Kether-2] Are you ready, Ain?</text><br>
                <text style='color:magenta'>[Ain] I'm ready.</text><br>
                <text style='color:magenta'>[Ain] Let's go, together we can definitely change the future of the world, using our own matching power to cross the door of the heart.</text><br>`
                return text
            }
        },
    },
    infoboxes: {
        'Ktr-i1': {
            title: "Recollection Waves",
            body() { 
                player.Ktr.content = ''
                for(var i = 0; i <= 999; i++){
                    if(tmp.Ktr.memoryLevel.gte(layers.Ktr.memoryBonus[i].start)) player.Ktr.content += "["+i+"]"+layers.Ktr.memoryBonus[i].desc+" "+quickBigColor(layers.Ktr.memoryBonus[i].prev+format(layers.Ktr.memoryBonus[i].effect()),layers.Ktr.memoryBonus[i].color)+"<br>"
                    else {
                        player.Ktr.content += quickColor('获得 '+formatWhole(layers.Ktr.memoryBonus[i].start.sub(tmp.Ktr.memoryLevel))+' 更多的回忆深度来解锁一个新的回忆之波!','gray')
                        break
                    }
                }
                return player.Ktr.content
            },
        },
    },
    clickables:{
        'Ktr-s1':{
            title() {return "<h4>吸收能量<br>"},
            gain() {
                let gain = n(1)
                if(player.Ktr.ark.gte(1)) gain = gain.mul(tmp.Ktr.arkEff)
                gain = gain.mul(buyableEffect('Ktr','Ktr-s1'))
                if(player.Ktr.ark.gte(1)) gain = gain.mul(layers.Ktr.buyables['Ktr','Ktr-s3'].effect())
                if(tmp.Ktr.memoryLevel.lt(42) && tmp.Ktr.memoryLevel.gte(15) && !hasAchievement('Ain','Hkm-4')) gain = gain.div(100)
                if(tmp.Ktr.memoryLevel.gte(42)) gain = gain.mul(100)
                if(tmp.Ktr.memoryLevel.gte(75)) gain = gain.mul(1000)
                if(player.Ktr.activeChallenge == 'Ktr-g1') gain = gain.pow(tmp.Ktr.gateEff)
                if(player.Ktr.storyUnlocked >= 9 || hasMilestone('Hkm','Hkm-6')) gain = gain.mul(player.Ktr.timeWrap)
                if(hasMilestone('Hkm','Hkm-1')) gain = gain.mul(tmp.Hkm.effect)
                if(tmp.Ktr.antimatter.gt(player.Ktr.stallar)) gain = n(0)
                return gain
            },
            display() {return "从你的星系中吸收恒星能源.<br>+"+formatWhole(this.gain())+' 恒星点数，冷却时间剩余 '+format(player.Ktr.stallarFreeze)+' 秒'},
            canClick() {return player.Ktr.stallarFreeze.lte(0)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px Moccasin', 'background-color':'lightyellow', 'color':'black', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'lightyellow'}
            },
            onClick() {
                player.Ktr.stallarFreeze = tmp.Ktr.stallarFreezeLimit 
                player.Ktr.stallar = player.Ktr.stallar.add(this.gain())
            },
        },
        'Ktr-a1':{
            title() {return "<h4>建造 +1 方舟<br>"},
            display() {return "重置你的恒星及恒星点数, 但是建造一个新的方舟并获取燃料。<br>"+"在方舟"+getBonusDesc()+"<br>"+formatWhole(player.Ktr.ark.add(1))+" 燃料"},
            canClick() {return player.Ktr.stallar.gte(tmp.Ktr.arkFullReq)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white', 'background': `repeating-linear-gradient(90deg, white 0, white 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'white'}
            },
            onClick() {
                player.Ktr.ark = player.Ktr.ark.add(1)
                player.Ktr.fuel = player.Ktr.fuel.add(player.Ktr.ark)
                player.Ktr.totalFuel = player.Ktr.totalFuel.add(player.Ktr.ark)
                if(player.Ktr.ark.lt(21)) for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            },
        },
        'Ktr-a2':{
            title() {return "进入遥远星空"},
            display() {return "需要15方舟燃料。解锁遥远星空升级。"},
            canClick() {return player.Ktr.fuel.gte(15)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.distant = true
            },
            unlocked(){return !player.Ktr.distant}
        },
        'Ktr-a3':{
            title() {return "洗点"},
            display() {return "洗点遥远星空升级并且拿回花费的燃料。"},
            canClick() {return true},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s-d'+i,n(0))
                }
                player.Ktr.fuel = player.Ktr.totalFuel
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
                player.Ktr.respeced = true
            },
            unlocked(){return player.Ktr.distant}
        },
        'Ktr-a4':{
            title() {return "进入极远星空"},
            display() {return "需要 2e42 恒星点数. 解锁一个新的子标签。"},
            canClick() {return player.Ktr.stallar.gte(2e42)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender', 'background': `repeating-linear-gradient(90deg, lavender 0, lavender 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'200px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.remote = true
            },
            unlocked(){return player.Ktr.distant && !player.Ktr.remote}
        },
        'Ktr-r1':{
            title() {return "穿越进入宇宙层级 "+tmp.Ktr.solarLayer[player.Ktr.solarLayer+1]},
            display() {return "<br>需要 "+format(tmp.Ktr.solarReq[player.Ktr.solarLayer])+" 恒星点数. 解锁一些新的星体."},
            canClick() {return player.Ktr.stallar.gte(tmp.Ktr.solarReq[player.Ktr.solarLayer])},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset '+tmp.Ktr.solarColor[player.Ktr.solarLayer+1],'background-color':`black`, 'color':'white', 'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':tmp.Ktr.solarColor[player.Ktr.solarLayer+1]}
                else return {'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                player.Ktr.solarLayer+=1
            },
        },
        'Ktr-r-c1':{
            title() {return "[Ktr-r-c1] 中子星 Lv."+tmp.Ktr.celestialLevel[0]},
            display() {return format(tmp.Ktr.celestialProgress[0])+'% 到下一等级'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(1.4,tmp.Ktr.celestialLevel[0])
                if(eff.gte(20000)) eff = softcap(eff,'root',n(20000),2.5)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[0].sqrt())
                if(eff.gte(50)) eff = softcap(eff,'root',n(50),1.5)
                return eff
            },
            onHold(){
                player.Ktr.solarPower[0] = player.Ktr.solarPower[0].add(tmp.Ktr.celestialGain[0].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 1},
            tooltip() {return quickBackgColor2("[质量] 22 Msun<br>[温度] 900000K",'#c999ff')+'<br><br>提升太阳能获取，并且产生免费红矮星。<br>效果1： ×'+format(this.effect1())+"<br>效果2： +"+format(this.effect2())+"<br>按住并获取 "+format(tmp.Ktr.celestialPerSec[0])+"% 中子星能量每秒."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[0].min(100))}%,black ${format(tmp.Ktr.celestialProgress[0].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
            },
        },
        'Ktr-r-c2':{
            title() {return "[Ktr-r-c2] 电弱星 Lv."+tmp.Ktr.celestialLevel[1]},
            display() {return format(tmp.Ktr.celestialProgress[1])+'% 到下一等级'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(666,tmp.Ktr.celestialLevel[1])
                if(getBuyableAmount('Ktr','Ktr-s-d6').gte(1)) eff = eff.pow(buyableEffect('Ktr','Ktr-s-d6'))
                if(eff.gte(1e20)) eff = softcap(eff,'root',n(1e20),4)
                return eff
            },
            onHold(){
                player.Ktr.solarPower[1] = player.Ktr.solarPower[1].add(tmp.Ktr.celestialGain[1].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 1},
            tooltip() {return quickBackgColor2("[质量] Undefined Msun<br>[温度] 2e16K",'#c999ff')+'<br><br>降低下一个方舟的需求。<br>效果: /'+format(this.effect1())+"<br>按住并获取 "+format(tmp.Ktr.celestialPerSec[1])+"% 电弱星能量每秒."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #c999ff','background':`linear-gradient(to right,#c999ff ${format(tmp.Ktr.celestialProgress[1].min(100))}%,black ${format(tmp.Ktr.celestialProgress[1].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#c999ff'}
            },
        },
        'Ktr-r-c3':{
            title() {return "[Ktr-r-c3] 先子星 Lv."+tmp.Ktr.celestialLevel[2]},
            display() {return format(tmp.Ktr.celestialProgress[2])+'% 到下一等级'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(1.9,tmp.Ktr.celestialLevel[2])
                if(eff.gte(200)) eff = softcap(eff,'root',n(200),1.5)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[2].root(3))
                return eff
            },
            onHold(){
                player.Ktr.solarPower[2] = player.Ktr.solarPower[2].add(tmp.Ktr.celestialGain[2].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 2},
            tooltip() {return quickBackgColor("[质量] 1000 Msun<br>[温度] 100000K",'#8619ff')+'<br><br>提升太阳能获取，并且产生免费橙矮星。<br>效果1： ×'+format(this.effect1())+"<br>效果2： +"+format(this.effect2())+"<br>按住并获取 "+format(tmp.Ktr.celestialPerSec[2])+"% 先子星能量每秒."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[2].min(100))}%,black ${format(tmp.Ktr.celestialProgress[2].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
            },
        },
        'Ktr-r-c4':{
            title() {return "[Ktr-r-c4] 类星 Lv."+tmp.Ktr.celestialLevel[3]},
            display() {return format(tmp.Ktr.celestialProgress[3])+'% 到下一等级'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.mul(5,tmp.Ktr.celestialLevel[3])
                return eff
            },
            onHold(){
                player.Ktr.solarPower[3] = player.Ktr.solarPower[3].add(tmp.Ktr.celestialGain[3].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 2},
            tooltip() {return quickBackgColor("[质量] 几乎无限 Msun<br>[温度] 1e14K",'#8619ff')+'<br><br>降低 Ktr-s-d4 和 Ktr-s-d5 的花费.<br>效果: -'+format(this.effect1())+"<br>按住并获取 "+format(tmp.Ktr.celestialPerSec[3])+"% 类星能量每秒."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #8619ff','background':`linear-gradient(to right,#8619ff ${format(tmp.Ktr.celestialProgress[3].min(100))}%,black ${format(tmp.Ktr.celestialProgress[3].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#8619ff'}
            },
        },
        'Ktr-r-c5':{
            title() {return "[Ktr-r-c5] Ton-618 黑洞 Lv."+tmp.Ktr.celestialLevel[4]},
            display() {return format(tmp.Ktr.celestialProgress[4])+'% 到下一等级'},
            canClick() {return true},
            effect1(){
                let eff = Decimal.pow(2.6,tmp.Ktr.celestialLevel[4])
                if(eff.gte(1000)) eff = softcap(eff,'root',n(1000),2)
                return eff
            },
            effect2(){
                let eff = Decimal.pow(2,tmp.Ktr.celestialLevel[4].root(5))
                return eff
            },
            onHold(){
                player.Ktr.solarPower[4] = player.Ktr.solarPower[4].add(tmp.Ktr.celestialGain[4].mul(0.05))
            },
            unlocked(){return player.Ktr.solarLayer >= 3},
            tooltip() {return quickBackgColor("[质量] 6e10 Msun<br>[温度] -273.15K",'#480099')+'<br><br>提升太阳能获取，并且产生免费黄矮星。<br>效果1： ×'+format(this.effect1())+"<br>效果2： +"+format(this.effect2())+"<br>按住并获取 "+format(tmp.Ktr.celestialPerSec[4])+"% 黑洞能量每秒."},
            style(){
                return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #480099','background':`linear-gradient(to right,#480099 ${format(tmp.Ktr.celestialProgress[4].min(100))}%,black ${format(tmp.Ktr.celestialProgress[4].add(0.25).min(100))}%)`, 'color':'white', 'min-height':'80px', 'width':'600px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#480099'}
            },
        },
        'Ktr-g1k':{
            title() {return "时间 ×1k"},
            canClick() {return player.Ktr.timeWrap != 1000 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 1000) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px dodgerblue', 'background-color':'dodgerblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'dodgerblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(1000)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e10)}
        },
        'Ktr-g10':{
            title() {return "时间 ×10"},
            canClick() {return player.Ktr.timeWrap != 10 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 10) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px deepskyblue', 'background-color':'deepskyblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'deepskyblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(10)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e6)}
        },
        'Ktr-g2':{
            title() {return "时间 ×2"},
            canClick() {return player.Ktr.timeWrap != 2 && player.Ktr.activeChallenge != 'Ktr-g1'},
            style(){
                if(player.Ktr.timeWrap != 2) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px skyblue', 'background-color':'skyblue', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'skyblue'}
            },
            onClick() {
                player.Ktr.timeWrap = n(2)
            },
        },
        'Ktr-g1':{
            title() {return "时间 ×1"},
            canClick() {return player.Ktr.timeWrap != 1},
            style(){
                if(player.Ktr.timeWrap != 1) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white', 'background-color':'white', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'white'}
            },
            onClick() {
                player.Ktr.timeWrap = n(1)
            },
        },
        'Ktr-g1/2':{
            title() {return "时间 ×1/2"},
            canClick() {return player.Ktr.timeWrap != 0.5},
            style(){
                if(player.Ktr.timeWrap != 0.5) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #ffcece', 'background-color':'#ffcece', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'#ffcece'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.5)
            },
        },
        'Ktr-g1/4':{
            title() {return "时间 ×1/4"},
            canClick() {return player.Ktr.timeWrap != 0.25},
            style(){
                if(player.Ktr.timeWrap != 0.25) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #FA8072', 'background-color':'#FA8072', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'#FA8072'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.25)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e6)}
        },
        'Ktr-g1/8':{
            title() {return "时间 ×1/8"},
            canClick() {return player.Ktr.timeWrap != 0.125},
            style(){
                if(player.Ktr.timeWrap != 0.125) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px red', 'background-color':'red', 'color':'black', 'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px' }
                else return {'min-height':'50px', 'width':'100px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'red'}
            },
            onClick() {
                player.Ktr.timeWrap = n(0.125)
            },
            unlocked(){return player.Ktr.memoryCrystal.gte(1e10)}
        },
    },
    buyables:{
        'Ktr-s3': {
            title() {return '<h3>[Ktr-s3] 红矮星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[质量] 90 Mjupitar<br>[温度] 2500K","#FF0000")+'<br><br>倍增恒星点数获取.<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+formatWhole(this.effect())+"<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(3, new Decimal(x).pow(1.8)).mul(200).floor() 
		        if(x>10) cost = cost.mul(Decimal.pow(1e3,Decimal.pow(x-10,3)))
                if(getBuyableAmount('Ktr','Ktr-s6').gte(1)) cost = cost.pow(buyableEffect('Ktr','Ktr-s6'))
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(1)},
            effect(x){
                let amount = n(x).add(player.Ktr.ark.gte(2)? 0.5 : 0).add(player.Ktr.ark.gte(5)? 0.5 : 0).add(player.Ktr.ark.gte(5)? buyableEffect('Ktr','Ktr-s-d3'):0).add(hasUpgrade('Ktr','Ktr-12')? 1 : 0).add(player.Ktr.solarPower[0].gte(1)? tmp.Ktr.clickables['Ktr-r-c1'].effect2 : 0)
                let eff = Decimal.pow(n(3).add(player.Ktr.ark.gte(4)?buyableEffect('Ktr','Ktr-s4'):0),amount)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#CC0000,#EE0000 20px,#CC0000 50px,#EE0000 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 2px 2px red' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'red','margin-left':'5px'}
            },
        },
        'Ktr-m1': {
            title() {return '<h3>[Ktr-m1] 时间之诗<br>'},
            display() {return '增加 25 到Kether的回忆进度中。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" Kether点数"},
            canAfford() {return player.Ktr.points.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                if(!hasMilestone('Hkm','Hkm-4')) player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'silver', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-m2': {
            title() {return '<h3>[Ktr-m2] 记忆之轨<br>'},
            display() {return '增加 50 到Kether的回忆进度中。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.05))
                return cost
            },
            buy(){
                if(!hasMilestone('Hkm','Hkm-4')) player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'PowderBlue'}}
                else return {'background-color':'PowderBlue ', 'color':'black','border-color':'PowderBlue ','box-shadow':'inset 3px 3px 3px #aabbaa,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-m3': {
            title() {return '<h3>[Ktr-m3] 时光之旅<br>'},
            display() {return '增加 200 到Kether的回忆进度中。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" 方舟"},
            canAfford() {return player.Ktr.ark.gte(this.cost())&&tmp.Ktr.memoryLevel.lt(100)},
            cost(x){
                let cost = n(x).add(1)
                if(tmp.Ktr.memoryLevel.gte(42)) cost = cost.sub(10).max(0)
                return cost
            },
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'Moccasin'}}
                else return {'background-color':'Moccasin', 'color':'black','border-color':'Moccasin','box-shadow':'inset 3px 3px 3px #ffffdd,0px 0px 10px #ffffff'}
            }
        },
        'Ktr-sta': {
            title() {if(tmp.Ktr.memoryLevel.lt(15)) return "<h3>Kether的状态：初醒<br>"
        else if(tmp.Ktr.memoryLevel.lt(42)) return "<h3>Kether的状态：印象培养<br>"
        else if(tmp.Ktr.memoryLevel.lt(75)) return "<h3>Kether的状态：印象升华<br>"
        else if(tmp.Ktr.memoryLevel.lt(100)) return "<h3>Kether的状态：印象觉醒<br>"
        else return "<h3>Kether的状态： 真我复苏<br>"},
            display() {if(tmp.Ktr.memoryLevel.lt(15)) return '<h2>无特殊效果。 (提示：到达深度 15, 42, 75 将会极大影响回忆之波的效果！)'
            else if(tmp.Ktr.memoryLevel.lt(42)) return '<h2>提升回忆之波 1 到 ^2 并且改良公式, 但是降低恒星点数获取 /100<br>点击以重置Kether的回忆。'
            else if(tmp.Ktr.memoryLevel.lt(75)) return '<h2>提升恒星和太阳能获取 100×(在一重软上限之后), 并且降低 Ktr-m3 的需求。<br>点击以重置Kether的回忆。'
            else if(tmp.Ktr.memoryLevel.lt(100)) return '<h2>提升100倍恒星能量获取，并且提升极远星空中所有资源获取10倍。<br>点击以重置Kether的回忆。'
            else return '<h2>心之门的通道已被打开。<br>是时候重写奇迹大陆的既定命运了。'},
            canAfford() {return tmp.Ktr.memoryLevel.gte(15)},
            buy(){
                setBuyableAmount('Ktr','Ktr-m1',n(0))
                setBuyableAmount('Ktr','Ktr-m2',n(0))
                setBuyableAmount('Ktr','Ktr-m3',n(0))
                player.Ktr.resetedMemory = true
            }
        },
        'Ktr-s1': {
            title() {return '<h3>[Ktr-s1] 气态巨行星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[质量] >0.6 Mjupitar<br>[温度] 200K","#775500")+'<br><br>倍增恒星点数获取.<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+format(this.effect())+"<br>花费： "+format(this.cost())+" Kether点数"},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(3,x)).mul(n(x).add(1))
                return cost
            },
            effect(x){
                if(!hasUpgrade('Ktr','Ktr-13')) eff = n(x).add(hasUpgrade('Ktr','Ktr-11')? 1 : 0)
                if(hasUpgrade('Ktr','Ktr-13')) eff = Decimal.pow(2,Decimal.add(x,1))
                return eff
            },
            buy(){
                player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-linear-gradient(0deg,#663300,#885500 20px,#775500 20px,#663300 40px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#775500','margin-left':'5px'}
            },
        },
        'Ktr-s2': {
            title() {return '<h3>[Ktr-s2] 褐矮星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[质量] 20 Mjupitar<br>[温度] 1000K","#AA5500")+'<br><br>吸收能量间隔减半。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：/"+formatWhole(this.effect())+"<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(200)},
            cost(x){
                let cost = Decimal.pow(n(1.8), new Decimal(x).pow(1.5)).mul(10).floor()
                return cost
            },
            effect(x){
                let eff = Decimal.pow(2,n(x).add(player.Ktr.ark.gte(1)? 1 : 0))
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#995500,#AA5500 20px,#AA5500 50px,#884400 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 1px 1px #AA5500' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#AA5500','margin-left':'5px'}
            },
        },
        'Ktr-s4': {
            title() {return '<h3>[Ktr-s4] 橙矮星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor("[质量] 0.4 Msun<br>[温度] 4000K","#FF8800")+'<br><br>增加红矮星基础.<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+formatWhole(this.effect())+"<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(6, new Decimal(3).pow(x)).mul(6666).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(3)},
            effect(x){
                let eff = n(x).add(player.Ktr.solarPower[2].gte(1)? tmp.Ktr.clickables['Ktr-r-c3'].effect2 : 0)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#CC7700,#EE8800 20px,#CC7700 50px,#EE8800 80px)', 'color':'white', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+3)+'px orange' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'orange','margin-left':'5px'}
            },
        },
        'Ktr-s5': {
            title() {return '<h3>[Ktr-s5] 黄矮星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor2("[质量] 0.92 Msun<br>[温度] 5500K","#FFFF00")+'<br><br>自动从你的恒星中吸收能量。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： "+formatWhole(this.effect())+" / 秒<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(3, new Decimal(3).pow(x)).times(1e7).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(5)},
            effect(x){
                let eff = Decimal.pow(n(4).add(getBuyableAmount('Ktr','Ktr-s-d1').gte(1)? buyableEffect('Ktr','Ktr-s-d1') : 0), n(x).add(player.Ktr.ark.gte(6)? getBuyableAmount('Ktr','Ktr-s1').mul(0.05):0).add(hasMilestone('Hkm','Hkm-1')? 1 : 0)).sub(1)
                if(hasUpgrade('Ktr','Ktr-15')) eff = eff.pow(3)
                if(player.Ktr.remote) eff = eff.mul(tmp.Ktr.solarEff.sqrt())
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#DDDD00,#EEEE00 20px,#DDDD00 50px,#EEEE00 80px)', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+4)+'px yellow' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'yellow','margin-left':'5px'}
            },
        },
        'Ktr-s6': {
            title() {return '<h3>[Ktr-s6] 白矮星<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return quickBackgColor2("[质量] 1.6 Msun<br>[温度] 7000K","#FFFFFF")+'<br><br>降低红矮星的价格膨胀指数。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： ^"+format(this.effect())+"<br>花费： "+format(this.cost())+" 恒星点数"},
            canAfford() {return player.Ktr.stallar.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(2, new Decimal(2.8).pow(x)).mul(1e27).floor()
                return cost
            },
            unlocked(){return player.Ktr.ark.gte(13)},
            effect(x){
                let eff = n(10).sub(new Decimal(x).add(1).log(2)).div(10).min(7)
                return eff
            },
            buy(){
                player.Ktr.stallar = player.Ktr.stallar.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'repeating-radial-gradient(#DDDDDD,#EEEEEE 20px,#DDDDDD 50px,#EEEEEE 80px)', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px white' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'white','margin-left':'5px'}
            },
        },
        'Ktr-s-d1': {
            title() {return '<h3>[Ktr-s-d1] 猎户臂<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '增加黄矮星基础0.3。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                let cost = n(x).div(2).plus(1).pow(2).floor()
                return cost
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.3,n(x))
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d2': {
            title() {return '<h3>[Ktr-s-d2] 仙女臂<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '提升方舟基础0.2。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                let cost = n(x).div(1.2).plus(1).pow(2).floor()
                return cost
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.2,x)
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d3': {
            title() {return '<h3>[Ktr-s-d3] 天蝎臂<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '每个褐矮星提供 .03 额外的红矮星.<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                if(x<5) return n(x).mul(2).plus(1).pow(2).floor() 
		        if(x==5) return new Decimal(1e9999)
            },
            unlocked(){return player.Ktr.distant},
            effect(x){
                let eff = Decimal.mul(0.03,x).mul(getBuyableAmount('Ktr','Ktr-s2'))
                return eff
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': 'lavender', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px lavender' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'lavender','margin-left':'5px'}
            },
        },
        'Ktr-s-d4': {
            title() {return '<h3>[Ktr-s-d4] 仙女座星系<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '提升 [极远星空] 中所有资源获取。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(n(1.5).add(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[6].start)? 0.5 : 0),x)
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-s-d5': {
            title() {return '<h3>[Ktr-s-d5] NGC 2068<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '提升太阳能获取。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.4).plus(1).pow(2).sub(player.Ktr.solarPower[3].gte(1)? tmp.Ktr.clickables['Ktr-r-c4'].effect1 : 0).floor().max(0)
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.pow(2,x)
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-s-d6': {
            title() {return '<h3>[Ktr-s-d6] NGC 4486<br>Lv.'+getBuyableAmount(this.layer,this.id)},
            tooltip() {return '提升电弱星效果到一个指数。<br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： ^"+format(this.effect())+"<br>花费： "+formatWhole(this.cost())+" 方舟燃料"},
            canAfford() {return player.Ktr.fuel.gte(this.cost()) && getBuyableAmount(this.layer,this.id).lt(100)},
            cost(x){
                return n(x).mul(1.8).plus(1).pow(2).floor()
            },
            unlocked(){return player.Ktr.ark.gte(21)},
            effect(x){
                return Decimal.add(1,x.add(1).log(4))
            },
            buy(){
                if(!hasAchievement('Ain','Hkm-6')) player.Ktr.fuel = player.Ktr.fuel.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style(){
                if(this.canAfford()) return {'background': '#c999ff', 'color':'black', 'height':'150px', 'width':'150px','border-radius':'50%','margin-left':'5px','box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px #c999ff' }
                else return {'height':'150px', 'width':'150px','border-radius':'50%','background-color':'black','color':'white','border-color':'#c999ff','margin-left':'5px'}
            },
        },
        'Ktr-g-h1': {
            title() {return "<h3>[i] 谜之海 "+(this.enabled()? quickColor('(稳定)','green'):quickColor('(不稳定)','red'))},
            display() {let dis = '<h2>[Kether] 真理的终极之美是通过在每一次失败和反思中不断战胜自己而实现的。如果你每次进入心门，结果至少比前一次好7倍，我认为你已经做到了这一点。'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(300)) dis += '<br><br>'+quickColor('到达300秒现实时间来探索更多。','grey')
            else dis += '<br><br>'+quickColor('你每离开心之门，你需要连续三次获得从上一次退出获得的记忆水晶的至少7倍以稳定它。','red')}
            else dis += '<br><br>'+quickColor('记忆水晶获取 ×20','green')
            return dis
            },
            enabled() {return this.unlocked() && (player.Ktr.gate1 >= 3 || hasMilestone('Hkm','Hkm-1'))},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9}
        },
        'Ktr-g-h2': {
            title() {return "<h3>[ii] 幻之海 "+(this.enabled()? quickColor('(稳定)','green'):quickColor('(不稳定)','red'))},
            display() {let dis = '<h2>[Kether] 平衡法则无疑适用于星际世界的所有事物。在方舟的燃料使用上，你可以深刻理解这一点。'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(1000)) dis += '<br><br>'+quickColor('到达1000秒现实时间来探索更多。','black')
            else dis += '<br><br>'+quickColor('让你在极远星空的所有升级都超过lv.6（除了Ktr-s-d3，它只需要超过lv.4）来稳定它。','red')}
            else dis += '<br><br>'+quickColor('心之门削弱指数 +^0.05','green')
            return dis
            },
            enabled() {return this.unlocked() && ((getBuyableAmount('Ktr','Ktr-s-d1').gte(7) && getBuyableAmount('Ktr','Ktr-s-d2').gte(7) && getBuyableAmount('Ktr','Ktr-s-d3').gte(5) && getBuyableAmount('Ktr','Ktr-s-d4').gte(7) && getBuyableAmount('Ktr','Ktr-s-d5').gte(7) && getBuyableAmount('Ktr','Ktr-s-d6').gte(7)) || hasMilestone('Hkm','Hkm-1') )},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e6)}
         },
        'Ktr-g-h3': {
            title() {return "<h3>[iii] 梦之海 "+(this.enabled()? quickColor('(稳定)','green'):quickColor('(不稳定)','red'))},
            display() {let dis = '<h2>[Kether] 宇宙中所有的奇迹都建立在正确的时间基础之上。如果你能在整数的时刻放慢时间，那么你就有可能掌握所有事物的时间。'
            if(!this.enabled()) {if(player.Ktr.realTime.lt(2000)) dis += '<br><br>'+quickColor('到达2000秒现实时间来探索更多。','black')
            else dis += '<br><br>'+quickColor('将时间跨度率更改为 x1/8，并等待您的宇宙时间可以被 60s（1min） 整除以稳定它。（120s，180s，240s等）','red')}
            else dis += '<br><br>'+quickColor('心之门削弱指数 x2','green')
            return dis
            },
            enabled() {return this.unlocked() && ((player.Ktr.universalTime.gte(30) && player.Ktr.universalTime.toNumber() % 60 <= 2 && player.Ktr.timeWrap < n(0.2)) || hasMilestone('Hkm','Hkm-1'))},
            canAfford() {return false},
            unlocked() {return player.Ktr.storyUnlocked >= 9 && player.Ktr.memoryCrystal.gte(1e10)}
        },
    },
    challenges:{
        'Ktr-g1':{
            name() {return "心之门 "+((this.locked())?'(锁定)':(player.Ktr.activeChallenge == 'Ktr-g1'?("("+formatWhole(this.gain())+")"):("(不活跃)")))},
            text() {return "❂"},
            locked() {return player.Ktr.storyUnlocked < 9},
            exp: "",
            color: '#FFFFFF',
            challengeDescription() {
                let desc = "↑↑点击当前 saphirah 的标志来进入心之门！<br>——————————————————<br>心之门效果：<br>1) 极度削弱恒星点数的获取. 但是随着你进入心之门时间的推移，恒星点数会获得一个指数加成。<br>2) 反物质将会在一段时间内开始产生。如果它超越了你的恒星点数, 你将不会获取更多恒星点数.<br>3) 在退出心之门时获取记忆水晶。<br>3) 黄矮星没有任何效果。<br>——————————————————<br>到达 1e6 和 1e10 记忆水晶 来解锁更多内容。<br>——————————————————目标: 1e20 记忆水晶<br>Reward: 解锁 Hokma."
                return desc
            },
            gain(){
                let gain = player.Ktr.stallar.add(1).pow(0.22).floor()
                if(layers.Ktr.buyables['Ktr-g-h1'].enabled()) gain = gain.mul(20)
                if(gain.gte(1e20)) gain = softcap(gain,'root',n(1e20),15)
                if(gain.gte(1e35)) gain = n(1e35)
                return gain
            },
            style() {
                if(player.Ktr.memoryCrystal.gte(1e20)) return {'background-color':'#44FF44','box-shadow':'0px 0px 3px 3px #44FF44'}
                else if(player.Ktr.activeChallenge == 'Ktr-g1') return {'background-color':'#dddddd','box-shadow':'0px 0px 6px 6px #dddddd'}
                else if(!this.locked()) return {'background-color':'#dddddd','box-shadow':'0px 0px 3px 3px #dddddd'}
                else return {'background-color':'#888888'}
            },
            onEnter() {
                player.Ktr.timeWrap = n(1)
                for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            },
            onExit()
            {
                if(this.gain().gte((player.Ktr.lastCrystal).mul(7))) player.Ktr.gate1 += 1
                else player.Ktr.gate1 = 0;
                player.Ktr.memoryCrystal = player.Ktr.memoryCrystal.add(this.gain())
                player.Ktr.lastCrystal = this.gain()
                player.Ktr.universalTime = n(0)
                player.Ktr.realTime = n(0)
            },
        },
    },
    bars: {
        'Ktr-m1': {
            direction: RIGHT,
            width: 600,
            height: 10,
            progress() { return tmp.Ktr.memoryLevel.div(100) },
            fillStyle() { return {'background-color':'skyblue'}},
            borderStyle() { return {'border-color':'skyblue'}},
        },
        'Ktr-a1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Ktr.stallar)+' / '+formatWhole(tmp.Ktr.arkFullReq)+' 恒星点数 到下一个方舟'},
            progress() { return player.Ktr.stallar.div(tmp.Ktr.arkFullReq) },
            fillStyle() { return {'background-color':'lightyellow'}},
            borderStyle() { return {'border-color':'lightyellow'}},
        },
        'Ktr-g1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return '需求1: '+format(player.Ktr.stallar)+' / '+format(1e245)+' 恒星点数'},
            progress() { return player.Ktr.stallar.add(1).log(10).div(245) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
        'Ktr-g2': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return '需求2: '+formatWhole(tmp.Ktr.memoryLevel)+' / '+formatWhole(100)+' 记忆深度'},
            progress() { return tmp.Ktr.memoryLevel.div(100) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
        'Ktr-g3': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return '需求3: '+formatWhole(player.Ktr.solarLayer)+' / '+formatWhole(3)+' 宇宙层级'},
            progress() { return n(player.Ktr.solarLayer / 3) },
            fillStyle() { if(this.progress().lt(1)) return {'background-color':'#999999'}
            else return {'background-color':'green'}},
            unlocked(){ return player.Ktr.storyUnlocked < 9}
        },
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('Ktr','Ktr-6')) mult = mult.mul(upgradeEffect('Ktr','Ktr-6'))
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[1].start)) mult = mult.mul(tmp.Ktr.memoryBonus[1].effect)
        if(player.Ktr.ark.gte(1)) mult = mult.mul(tmp.Ktr.arkEff)
        if(mult.gte(1e100)) mult = softcap(mult,'root',n(1e100),1.8)
        if(hasMilestone('Hkm','Hkm-1')) mult = mult.mul(tmp.Hkm.effect)
        if(hasUpgrade('Hkm','Hkm-5')) mult = mult.mul(1e50)
        if(player.Hkm.storyUnlocked >= 6) mult = mult.mul(tmp.Hkm.foemEff1)
        if(hasUpgrade('Ktr','Ktr-18')) mult = mult.mul(tmp.Hkm.BatteryEff2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[2].start)) exp = exp.mul(1.03)
        return exp
    },
    storyPending() {
        let story = 0;
        if(player.Ktr.points.gte(1)) story = 1;
        if(hasUpgrade('Ktr','Ktr-1') && player.Ktr.storyUnlocked == 1) story = 2;
        if(player.points.gte(200000) && player.Ktr.storyUnlocked == 2) story = 3;
        if(player.Ktr.stallar.gte(200) && player.Ktr.storyUnlocked == 3) story = 4;
        if(player.Ktr.ark.gte(3) && player.Ktr.storyUnlocked == 4) story = 5;
        if(player.Ktr.distant && player.Ktr.storyUnlocked == 5) story = 6;
        if(player.Ktr.remote && player.Ktr.storyUnlocked == 6) story = 7;
        if(player.Ktr.ark.gte(21) && player.Ktr.storyUnlocked == 7) story = 8;
        if(tmp.Ktr.memoryLevel.gte(100) && player.Ktr.stallar.gte(1e245) && player.Ktr.solarLayer >= 3 && player.Ktr.storyUnlocked == 8) story = 9;
        return story
    },
    memoryLevel(){
        if(hasMilestone('Hkm','Hkm-11')) return n(100)
        let memory = getBuyableAmount('Ktr','Ktr-m1').mul(25).add(getBuyableAmount('Ktr','Ktr-m2').mul(50)).add(getBuyableAmount('Ktr','Ktr-m3').mul(200))
        return memory.div(200).floor().min(100)
    },
    memorytoNext(){
        let memory = getBuyableAmount('Ktr','Ktr-m1').mul(25).add(getBuyableAmount('Ktr','Ktr-m2').mul(50)).add(getBuyableAmount('Ktr','Ktr-m3').mul(200))
        return (memory.div(200).sub(memory.div(200).floor())).mul(100).min(100)
    },
    stallarFreezeLimit(){
        return n(2).div(buyableEffect('Ktr','Ktr-s2'))
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades:{
        'Ktr-1': {
            title() {return quickColor('['+this.id+']'+'<h3>抖落繁星<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '万物的起源. 每秒获得1精华。'},
            effect() {
                let eff = new Decimal(1)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '+'+format(layers.Ktr.upgrades[this.layer,this.id].effect())+"/sec"},
            cost() {return n(1)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
        },
        'Ktr-2': {
            title() {return quickColor('['+this.id+']'+'<h3>克洛德与观星者<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '基于 Kether点数 获得极小的精华加成。'},
            effect() {
                let eff = player.Ktr.points.pow(hasUpgrade('Ktr','Ktr-9')? 1.5 : 1).add(1).root(2)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(50)) eff = softcap(eff,'root',n(50),2.5)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),15)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            cost() {return n(3)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-1')
            }
        },
        'Ktr-3': {
            title() {return quickColor('['+this.id+']'+'<h3>纯白浪花<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '精华提升自身获取。'},
            effect() {
                let eff = player.points.add(1).pow(hasUpgrade('Ktr','Ktr-4')? 1.5 : 1).pow(hasUpgrade('Ktr','Ktr-5')? 1.5 : 1).log(9).add(1)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(10)) eff = softcap(eff,'root',n(10),n(2).sub(hasUpgrade('Ktr','Ktr-14')? 0.8: 0))
                if(eff.gte(1e20)) eff = softcap(eff,'root',n(1e20),15)
                if(tmp.Ktr.memoryLevel.gte(tmp.Ktr.memoryBonus[4].start)) eff = eff.pow(4)
                return eff
            },
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            cost() {return n(5)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-2')
            }
        },
        'Ktr-4': {
            title() {return quickColor('['+this.id+']'+'<h3>星河遨游<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-3 公式更好。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(20)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-3')
            }
        },
        'Ktr-5': {
            title() {return quickColor('['+this.id+']'+'<h3>星之引导<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-3 公式更更更好'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(40)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-4')
            }
        },
        'Ktr-6': {
            title() {return quickColor('['+this.id+']'+'<h3>星海纽带<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '每个已购买的升级都会增加 Kether点数 的获取。'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(player.Ktr.upgrades.length).add(hasUpgrade('Ktr','Ktr-10')? 4 : 0).mul(0.15).add(1)
                if(hasUpgrade('Ktr','Ktr-7')) eff = eff.mul(upgradeEffect('Ktr','Ktr-7'))
                if(eff.gte(1e6)) softcap(eff,'root',n(1e6),3)
                if(eff.gte(1e100)) softcap(eff,'root',n(1e100),15)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(60)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-5')
            }
        },
        'Ktr-7': {
            title() {return quickColor('['+this.id+']'+'<h3>星烁<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '让部分先前的升级都获得一个加成。（不知道怎么翻译好了。）'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(1.3)
                if(hasUpgrade('Ktr','Ktr-8')) eff = eff.pow(upgradeEffect('Ktr','Ktr-8'))
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(150)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-6')
            }
        },
        'Ktr-8': {
            title() {return quickColor('['+this.id+']'+'<h3>星尘<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-7 也对自己生效。'},
            color(){return '#ffffff'},
            effect() {
                let eff = n(2)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(500)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-7')
            }
        },
        'Ktr-9': {
            title() {return quickColor('['+this.id+']'+'<h3>永恒星光<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-2 使用更好的公式，软上限也更弱了。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-8')
            }
        },
        'Ktr-10': {
            title() {return quickColor('['+this.id+']'+'<h3>9 1/4 站台<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '相当于5个升级。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(2000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-9')
            }
        },
        'Ktr-11': {
            title() {return quickColor('['+this.id+']'+'<h3>星之碎片<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '获得一个气态巨行星。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(20000)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-10') && player.Ktr.storyUnlocked >= 3
            }
        },
        'Ktr-12': {
            title() {return quickColor('['+this.id+']'+'<h3>Farewell Starlight<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '获得一个红矮星。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e21)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-11') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-13': {
            title() {return quickColor('['+this.id+']'+'<h3>忆海深处<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '气态巨行星效果公式得到大大改良。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e30)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-12') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-14': {
            title() {return quickColor('['+this.id+']'+'<h3>别离脚步<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return 'Ktr-3 软上限被些微削弱。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(1e48)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {
                return hasUpgrade('Ktr','Ktr-13') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-15': {
            title() {return quickColor('['+this.id+']'+'<h3>星轨测算者<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '大大增幅黄矮星的效果。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n(2e49)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(3)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-14') && player.Ktr.storyUnlocked >= 6
            }
        },
        'Ktr-16': {
            title() {return quickColor('['+this.id+']'+'<h3>星际快递<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '提升方盒获取基于 Kether点数.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1050')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = player.Ktr.points.add(1).log10().div(100).sqrt().add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-15') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-17': {
            title() {return quickColor('['+this.id+']'+'<h3>永恒之雪<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '转化时间方盒·逆流更快，基于时间方盒·顺流的效果。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1250')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = Decimal.log(new Decimal(1).add(tmp.Hkm.PeBoxEff).max(1), 10).add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-16') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-18': {
            title() {return quickColor('['+this.id+']'+'<h3>星痕<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '解锁永恒电池，并且转化 时间方盒·逆流 5倍更快。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e1500')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(5)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-17') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-19': {
            title() {return quickColor('['+this.id+']'+'<h3>不要让我失望<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '所有方盒生成速率基于 时间方盒·逆流 数量获得提升。'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2100')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(10).mul(n(1).add(player.Hkm.NeBox).max(1).log(100).add(1))
                if(hasUpgrade('Ktr','Ktr-20')) eff = eff.pow(2)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-18') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-20': {
            title() {return quickColor('['+this.id+']'+'<h3>向夜晚奔去<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '平方 Ktr-19.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2333')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = n(2)
                return eff
            },
            effectDisplay() {return '^'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-19') && hasAchievement('Ain','Hkm-16')
            }
        },
        'Ktr-21': {
            title() {return quickColor('['+this.id+']'+'<h3>悔恨光芒<br>',hasUpgrade(this.layer,this.id)?'green':'')},
            description() {return '基于燃料电池总等级倍增所有时间方盒获取，并解锁强大的四阶时间方盒.'},
            color(){return '#ffffff'},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost() {return n('1e2800')},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':'white'}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'green', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            effect() {
                let eff = player.Hkm.batteryThroem.add(1)
                return eff
            },
            effectDisplay() {return '×'+format(layers.Ktr.upgrades[this.layer,this.id].effect())},
            unlocked() {
                return hasUpgrade('Ktr','Ktr-20') && hasAchievement('Ain','Hkm-16')
            }
        },
    },
    layerShown(){return true},
    tabFormat:{
            "浮光忆海":{
                content:[
                "main-display",
                "prestige-button",
                "blank",
                ["row",[["upgrade","Ktr-1"],["upgrade","Ktr-2"],["upgrade","Ktr-3"],["upgrade","Ktr-4"],["upgrade","Ktr-5"]]],
                ["row",[["upgrade","Ktr-6"],["upgrade","Ktr-7"],["upgrade","Ktr-8"],["upgrade","Ktr-9"],["upgrade","Ktr-10"]]],
                ["row",[["upgrade","Ktr-11"],["upgrade","Ktr-12"],["upgrade","Ktr-13"],["upgrade","Ktr-14"],["upgrade","Ktr-15"]]],
                ["row",[["upgrade","Ktr-16"],["upgrade","Ktr-17"],["upgrade","Ktr-18"],["upgrade","Ktr-19"],["upgrade","Ktr-20"]]],
                ["row",[["upgrade","Ktr-21"],["upgrade","Ktr-22"],["upgrade","Ktr-23"],["upgrade","Ktr-24"],["upgrade","Ktr-25"]]],
                'blank',
                ['display-text',function(){if(player.Ktr.storyUnlocked < 3) return '<h4>'+quickColor("[Hints] 点击上方的按钮来重置精华，但获得 Kether点数.<br>Kether点数 可以购买倍增资源获取的永久升级.<br><br>抵达 200,000 精华来继续旅程.",'grey')}],
                ]
            },
            "观星台":{
                content:[
                    ['display-text',function(){return '<h4>你拥有 '+quickBigColor(formatWhole(player.Ktr.stallar),'Moccasin') +' 恒星点数, 提升精华获取 '+quickBigColor('×'+format(tmp.Ktr.stallarEff),'moccasin')+' .'}],
                    "blank",
                    ['clickable','Ktr-s1'],
                    "blank",
                    ['row',[['buyable','Ktr-s1'],['buyable','Ktr-s2'],['buyable','Ktr-s3'],['buyable','Ktr-s4']]],
                    ['row',[['buyable','Ktr-s5'],['buyable','Ktr-s6']]],
                    'blank',
                ],
                unlocked(){return player.Ktr.storyUnlocked >= 3},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, lightyellow 40%)','color':'black','box-shadow':'2px 2px 2px white'}},
                style(){
                    return {
                        "background-image":
                        "linear-gradient(#000 30px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                        "background-size":"31px 31px,31px 31px",
                        "background-position":""+(player.timePlayed)%100+"%"+" "+(player.timePlayed%100)+"%"
                    }
                }
            },
            "近地方舟":{
                content:[
                ['display-text',function(){return '<h4>你已经建造了 '+quickBigColor(formatWhole(player.Ktr.ark),'white') +' 方舟. 倍增大多数先前资源 '+quickBigColor('×'+format(tmp.Ktr.arkEff),'white')}],
                ['bar','Ktr-a1'],
                "blank",
                ['row',[['clickable','Ktr-a1'],['clickable','Ktr-a2'],['clickable','Ktr-a3'],['clickable','Ktr-a4']]],
                "blank",
                ['display-text',function(){return '<h4>你的方舟总共有 '+quickBigColor(formatWhole(player.Ktr.fuel),'lavender') +'燃料.'}],
                "blank",
                ["row",[["buyable","Ktr-s-d1"],["buyable","Ktr-s-d2"],["buyable","Ktr-s-d3"]]],
                ["row",[["buyable","Ktr-s-d4"],["buyable","Ktr-s-d5"],["buyable","Ktr-s-d6"]]],
            ],
                unlocked(){return player.Ktr.storyUnlocked >= 4},
                buttonStyle(){return {'background':'white','color':'black','box-shadow':'2px 2px 2px grey'}}
            },
            "极远星空":{
                content:[
                ['display-text',function(){return '<h4>你的方舟总共接收到了 '+quickBigColor(formatWhole(tmp.Ktr.solarEnergy),'lavender') +' 太阳能. 提升方舟与黄矮星效果 '+quickBigColor('×'+format(tmp.Ktr.solarEff),'lavender')}],
                ['display-text',function(){return quickBigColor('[宇宙层级:'+tmp.Ktr.solarLayer[player.Ktr.solarLayer]+']',tmp.Ktr.solarColor[player.Ktr.solarLayer])}],
                ['clickable','Ktr-r1'],
                'blank',
                ['clickable','Ktr-r-c1'],
                ['clickable','Ktr-r-c2'],
                ['clickable','Ktr-r-c3'],
                ['clickable','Ktr-r-c4'],
                ['clickable','Ktr-r-c5'],
            ],
                unlocked(){return player.Ktr.remote},
                buttonStyle(){return {'background':'lavender','color':'black','box-shadow':'2px 2px 2px grey'}},
                style(){
                    return {
                        'background': 'linear-gradient(135deg, #000000 22px, #111133 22px, #111133 24px, transparent 24px, transparent 67px, #111133 67px, #111133 69px, transparent 69px),linear-gradient(225deg, #000000 22px, #111133 22px, #111133 24px, transparent 24px, transparent 67px, #111133 67px, #111133 69px, transparent 69px)0 64px',
                        'background-color':'black',
                        'background-size':'64px 128px',
                        "background-position":"100%"+" "+(player.timePlayed%100)+"%"
                    }
                }
            },
            "时光钟表铺":{
                content:[
                ['display-text',function(){return '<h4>Kether的回忆在深度 '+quickBigColor(formatWhole(tmp.Ktr.memoryLevel),'white') +'中, 这提供了以下的奖励'}],
                ['display-text',function(){return '<h4>'+quickBigColor(formatWhole(tmp.Ktr.memorytoNext)+'%','white') +' 到下一深度'}],
                "blank",
                ['infobox','Ktr-i1'],
                "blank",
                ["row",[["buyable","Ktr-m1"],["buyable","Ktr-m2"],["buyable","Ktr-m3"]]],
                ['buyable','Ktr-sta'],
                ['bar','Ktr-m1'],
                ],
                unlocked(){return player.Ktr.storyUnlocked >= 3},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, skyblue 92%)','color':'black','box-shadow':'2px 2px 2px white'}}
            },
            "心之门":{
                content:[
                    ['bar','Ktr-g1'],
                    ['bar','Ktr-g2'],
                    ['bar','Ktr-g3'],
                    "blank",
                    ['display-text',function(){if(player.Ktr.storyUnlocked >= 9)return '<h4>你总共收集了 '+quickBigColor(formatWhole(player.Ktr.memoryCrystal),'white') +' 记忆水晶. 它自身加成太阳能获取量。(无视心之门削弱)'}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>宇宙时间： '+quickBigColor(formatTime(player.Ktr.universalTime),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>现实时间: '+quickBigColor(formatTime(player.Ktr.realTime),'white')+', 当前心之门削弱指数为 '+quickBigColor('^'+format(tmp.Ktr.gateEff),'white')}],
                    ['display-text',function(){if(player.Ktr.activeChallenge == 'Ktr-g1')return '<h4>你拥有 '+quickBigColor(formatWhole(tmp.Ktr.antimatter),'white')+' 反物质.'}],
                    "blank",
                    ['row',[['challenge','Ktr-g1'],["column", [["raw-html", function() {}],
                    "blank",['display-text',function(){return '<h3>[黑洞控制器]<br>更改宇宙时间流速。'}],
                   ['column',["blank",["clickable",'Ktr-g1k'],["clickable",'Ktr-g10'],["clickable",'Ktr-g2'],["clickable",'Ktr-g1'],["clickable",'Ktr-g1/2'],["clickable",'Ktr-g1/4'],["clickable",'Ktr-g1/8']]],
                   "blank",
                   ],
                   {
                       "color":"white",
                       "width":"300px",
                       "height":"700px",
                       "border-color":"#FFFFFF",
                       "border-width":"3px",
                       "background-color":"black",
                   },
                ]]],
                'blank',
                ['display-text',function(){return '<h4>'+quickColor("[Hints] Kether 的心之门有三个独特但不稳定的内存通道，这些通道只有在满足某些特定条件时才会变得稳定并提供奖励。如果无法根据现有的线索确定内存通道的稳定状态，可以通过将其闲置在心门中一段时间来解锁。",'grey')}],
                'blank',
                ['buyable','Ktr-g-h1'],
                ['buyable','Ktr-g-h2'],
                ['buyable','Ktr-g-h3'],
                ],
                unlocked(){return tmp.Ktr.memoryLevel.gte(100) || player.Ktr.storyUnlocked >= 9},
                buttonStyle(){return {'background':'linear-gradient(to right,white 11%, grey 92%)','color':'black','box-shadow':'2px 2px 2px grey'}}
            },
    },
    update(diff){
        if(document.getElementById('Ktr') != null) player.Ktr.posk1 = document.getElementById('Ktr').getBoundingClientRect().left-225
        if(document.getElementById('Ktr') != null) player.Ktr.posk2 = document.getElementById('Ktr').getBoundingClientRect().top-150
        if(player.Ktr.stallarFreeze.gt(0)) player.Ktr.stallarFreeze = player.Ktr.stallarFreeze.sub(diff).max(0)
        if(tmp.Ktr.storyPending > player[this.layer].storyUnlocked) {
            player[this.layer].storyUnlocked = tmp.Ktr.storyPending;
            player[this.layer].newStory = true
            if(!hasMilestone('Hkm','Hkm-9')) doPopup(type = "none", text = "新的 Kether 故事解锁了!<br>(No. "+formatWhole(player[this.layer].storyUnlocked)+")", title = "古老的宇宙记忆苏醒了...", timer = 5, color = "white")
        }
        if(getBuyableAmount('Ktr','Ktr-s5').gte(1) || hasMilestone('Hkm','Hkm-1')) player.Ktr.stallar = player.Ktr.stallar.add((player.Ktr.activeChallenge == 'Ktr-g1'? n(0) : buyableEffect('Ktr','Ktr-s5')).mul(tmp.Ktr.clickables['Ktr-s1'].gain).mul(diff))
        if(player.Ktr.activeChallenge == 'Ktr-g1'){
            player.Ktr.realTime = player.Ktr.realTime.add(n(diff).mul(player.Hkm.unlocked? tmp.Hkm.effect : 1))
            player.Ktr.universalTime = player.Ktr.universalTime.add(n(diff).mul(player.Ktr.timeWrap))
        }
        if(hasMilestone('Hkm','Hkm-1') && player.Ktr.storyUnlocked >= 3){
            for(var i = 1; i <= 6; i++){
                if(layers.Ktr.buyables['Ktr-s'+i].unlocked) buyBuyable('Ktr','Ktr-s'+i)
            }
        }
        if(hasAchievement('Ain','Hkm-5') && player.Ktr.remote){
            for(var i = 1; i <= 5; i++){
                if(tmp.Ktr.celestialPerSec[i-1].gte(1) && tmp.Ktr.clickables['Ktr-r-c'+i].unlocked) player.Ktr.solarPower[i-1] = player.Ktr.solarPower[i-1].add(layers.Ktr.celestialGain()[i-1].mul(diff).mul(10))
            }
        }
        if(hasMilestone('Hkm','Hkm-3')){
            if(player.Ktr.stallar.gte(tmp.Ktr.arkFullReq)){
                player.Ktr.ark = player.Ktr.ark.add(1)
                player.Ktr.fuel = player.Ktr.fuel.add(player.Ktr.ark)
                player.Ktr.totalFuel = player.Ktr.totalFuel.add(player.Ktr.ark)
                if(player.Ktr.ark.lt(21)) for(var i = 1; i <= 6; i++){
                    setBuyableAmount('Ktr','Ktr-s'+i,n(0))
                }
                player.Ktr.stallar = n(0)
            }
        }
        if(hasMilestone('Hkm','Hkm-4')){
            buyBuyable('Ktr','Ktr-m1')
            buyBuyable('Ktr','Ktr-m2')
            buyBuyable('Ktr','Ktr-m3')
        }
        if(hasMilestone('Hkm','Hkm-5') && player.Ktr.stallar.gte(tmp.Ktr.solarReq[player.Ktr.solarLayer])) player.Ktr.solarLayer++
        if(hasMilestone('Hkm','Hkm-6')) player.Ktr.timeWrap = n(1000)
        if(hasMilestone('Hkm','Hkm-9')) {buyBuyable('Ktr','Ktr-s-d2'),buyBuyable('Ktr','Ktr-s-d3')}
        if(hasMilestone('Hkm','Hkm-10')) {buyBuyable('Ktr','Ktr-s-d1'),buyBuyable('Ktr','Ktr-s-d4'),buyBuyable('Ktr','Ktr-s-d5'),buyBuyable('Ktr','Ktr-s-d6')}
    },
})
addLayer("Hkm", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        storyUnlocked: 0,
        storyShowing: 1,
        newStory: false,
        resetTimes: 0,
        timeEnergy: new Decimal(0),
        timeThroem: new Decimal(0),
        totalTimeThroem: new Decimal(0),
        batteryThroem: new Decimal(0),
        gridTime: new Decimal(0),
        foems: new Decimal(0),
        PeBox: new Decimal(0),
        NeBox: new Decimal(0),
        maxBet: new Decimal(0),
                     // "points" is the internal name for the main resource of the layer.
    }},
    symbol(){return "Hkm<sup>"+player.Hkm.storyUnlocked},
    color: "grey",                       // The color for this layer, which affects many elements.
    resource: "Hokma 点数",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    passiveGeneration(){return hasAchievement('Ain','Hkm-7')? 10 : 0},
    baseResource: "Kether点数",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.Ktr.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e200),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to 解锁 the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 1e-300,
    branches: ['Ktr'],
    resetsNothing() {return false},                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
        if(hasAchievement('Ain','Hkm-3')) {
            bonus = Decimal.pow(2,player.Ktr.ark.sub(46)).max(1)
            if(bonus.gte(10)) bonus = softcap(bonus,'root',n(10),5)
            mult = mult.mul(bonus)
        }
        if(hasAchievement('Ain','Hkm-2')) mult = mult.mul(n(15).div(player.Ain.bestReset+0.2).add(1).min(30))
        if(hasUpgrade('Hkm','Hkm-1')) mult = mult.mul(upgradeEffect('Hkm','Hkm-1'))
        if(hasUpgrade('Hkm','Hkm-2')) mult = mult.mul(upgradeEffect('Hkm','Hkm-2'))
        if(hasGrid('Hkm',101)) mult = mult.mul(getEffect('',101))
        if(hasGrid('Hkm',201)) mult = mult.mul(getEffect('',201))
        if(hasGrid('Hkm',301)) mult = mult.mul(getEffect('',301))
        if(hasGrid('Hkm',401)) mult = mult.mul(getEffect('',401))
        if(player.Hkm.storyUnlocked >= 6) mult = mult.mul(tmp.Hkm.PeBoxEff)
        if(mult.gte(1e150)) mult = softcap(mult,'root',n(1e150),2.2)
        return mult              // Factor in any bonuses multiplying gain here.
    },
    effectDescription(){
        return "提升精华获取, Kether点数获取, 现实时间获取和恒星能量获取 " + quickBigColor(' ×'+format(tmp.Hkm.effect),'grey')
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    canReset(){
        return player.Ktr.memoryCrystal.gte(1e20) && player.Ktr.stallar.gte('1e330')
    },
    storyPending() {
        let story = 0;
        if(player.Hkm.points.gte(1)) story = 1;
        if(player.Ain.achievements.length >= 7 && player.Hkm.storyUnlocked == 1) story = 2;
        if(hasMilestone('Hkm','Hkm-13') && player.Hkm.storyUnlocked == 2) story = 3;
        if(hasMilestone('Hkm','Hkm-14') && player.Hkm.storyUnlocked == 3) story = 4;
        if(hasMilestone('Hkm','Hkm-15') && player.Hkm.storyUnlocked == 4) story = 5;
        if(hasMilestone('Hkm','Hkm-16') && player.Hkm.storyUnlocked == 5) story = 6;
        if(hasAchievement('Ain','Hkm-14') && player.Hkm.storyUnlocked == 6) story = 7;
        if(hasAchievement('Ain','Hkm-16') && player.Hkm.storyUnlocked == 7) story = 8;
        if(hasMilestone('Hkm','Hkm-17') && player.Hkm.storyUnlocked == 8) story = 9;
        if(hasUpgrade('Ktr','Ktr-18') && player.Hkm.storyUnlocked == 9) story = 10;
        if(hasMilestone('Hkm','Hkm-18') && player.Hkm.storyUnlocked == 10) story = 11;
        if(hasMilestone('Hkm','Hkm-19') && player.Hkm.storyUnlocked == 11) story = 12;
        return story
    },
    totalCompressor(){
        return getBuyableAmount('Hkm','Hkm-t1').add(getBuyableAmount('Hkm','Hkm-t2')).add(getBuyableAmount('Hkm','Hkm-t3'))
    },
    nextTimeThroem()
    {
        let lim = new Decimal(1).mul(new Decimal(10).pow(player.Hkm.totalTimeThroem.add(1)))
        if (player.Hkm.totalTimeThroem.gte(29)) lim = lim.mul(new Decimal(2).pow(player.Hkm.totalTimeThroem.sub(29)))
        if(hasGrid('Hkm',104)) lim = lim.div(getEffect('',104))
        return lim
    },
    timeThroemEff()
    {
        let eff = Decimal.pow(n(25),player.Hkm.totalTimeThroem)
        return eff
    },
    gridStrength(){
        let strength = n(1)
        if(player.Hkm.gridTime.lt(100)) strength = strength.sub(n(100).sub(player.Hkm.gridTime).div(100).mul(0.1))
        if(hasUpgrade('Hkm','Hkm-9')) strength = strength.add(0.05)
        if(hasUpgrade('Hkm','Hkm-9') && player.Hkm.gridTime.gte(100)) strength = strength.add(player.Hkm.gridTime.add(1).log(10).sub(2).div(100))
        for (var i = 103; i <= 1300; i += 100){
            if(hasGrid('Hkm',i)) strength = strength.add(getEffect('',i))
        }
        if(hasAchievement('Ain','Hkm-14')) strength = strength.add(buyableEffect('Hkm','Hkm-f2'))
        return strength
    },
    compressorEff(){
        let eff = Decimal.pow(n(3).add(hasUpgrade('Hkm','Hkm-6')? 2 : 0),tmp.Hkm.totalCompressor).sub(1)
        if(hasAchievement('Ain','Hkm-8')) eff = eff.mul(tmp.Ain.effect)
        if(hasUpgrade('Hkm','Hkm-7')) eff = eff.mul(tmp.Hkm.gridStrength.mul(1000))
        if(hasGrid('Hkm',204)) eff = eff.mul(getEffect('',204))
        if(hasGrid('Hkm',304)) eff = eff.mul(getEffect('',304))
        return eff
    },
    gridSize(){
        if(!hasMilestone('Hkm','Hkm-13')) return 0
        else if(!hasMilestone('Hkm','Hkm-14')) return 1
        else if(!hasMilestone('Hkm','Hkm-15')) return 2
        else if(!hasMilestone('Hkm','Hkm-17')) return 3
        else return 4
    },
    foemReq(){
        let req = n(0)
        if(player.Hkm.foems.lt(20)) req = new Decimal(2.5e4).pow(player.Hkm.foems).mul(1e24)
        return req
    },
    foemEff1(){
        let eff = Decimal.pow(1e40,player.Hkm.foems).mul(player.Hkm.foems.pow(7)).add(1)
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.mul(tmp.Hkm.Sebox)
        return eff
    },
    foemEff2(){
        let eff = Decimal.pow(3,player.Hkm.foems).sub(1).pow(hasUpgrade('Ktr','Ktr-18')? buyableEffect('Hkm','Hkm-b1').add(1) : 1)
        if(hasUpgrade('Ktr','Ktr-16')) eff = eff.mul(upgradeEffect('Ktr','Ktr-16'))
        if(hasUpgrade('Ktr','Ktr-19')) eff = eff.mul(upgradeEffect('Ktr','Ktr-19'))
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.mul(upgradeEffect('Ktr','Ktr-21'))
        return eff
    },
    boxGain(){
        let gain = getBuyableAmount('Hkm','Hkm-t1').add(getBuyableAmount('Hkm','Hkm-t2')).add(getBuyableAmount('Hkm','Hkm-t3'))
        if(hasAchievement('Ain','Hkm-14')) gain = gain.mul(buyableEffect('Hkm','Hkm-f4'))
        if(hasUpgrade('Ktr','Ktr-16')) gain = gain.mul(upgradeEffect('Ktr','Ktr-16'))
        if(hasUpgrade('Ktr','Ktr-17')) gain = gain.mul(upgradeEffect('Ktr','Ktr-17'))
        if(hasUpgrade('Ktr','Ktr-18')) gain = gain.mul(upgradeEffect('Ktr','Ktr-18'))
        if(hasUpgrade('Ktr','Ktr-19')) gain = gain.mul(upgradeEffect('Ktr','Ktr-19'))
        if(hasUpgrade('Ktr','Ktr-21')) gain = gain.mul(upgradeEffect('Ktr','Ktr-21'))
        return gain
    },
    NeBoxStroage(){
        let str = n(1000)
        if(hasUpgrade('Ktr','Ktr-18')) str = str.pow(buyableEffect('Hkm','Hkm-b2'))
        return str
    },
    NeBoxEff(){
        let eff = player.Hkm.NeBox.div(buyableEffect('Hkm','Hkm-b3')).add(1).log(1e10).add(1).cbrt().recip()
        eff = eff.pow(buyableEffect('Hkm','Hkm-f6'))
        if(hasUpgrade('Ktr','Ktr-21')) eff = eff.root(20)
        return eff
    },
    NeBoxGain(){
        return tmp.Hkm.foemEff2.sub(tmp.Hkm.boxGain)
    },
    PeBoxExp(){
        let exp = n(1.4).add(hasUpgrade('Ktr','Ktr-18')? buyableEffect('Hkm','Hkm-b1') : 0)
        return exp
    },
    PeBoxEff(){
        let eff = player.Hkm.PeBox.add(1).pow(tmp.Hkm.PeBoxExp).pow(tmp.Hkm.NeBoxEff)
        if(hasAchievement('Ain','Hkm-14')) eff = eff.pow(buyableEffect('Hkm','Hkm-f5'))
        return eff
    },
    PeBoxGain(){
        if(tmp.Hkm.NeBoxGain.lte(0)) return tmp.Hkm.foemEff2
        else return tmp.Hkm.boxGain
    },
    Sebox(){
        return player.Hkm.PeBox.add(1).mul(player.Hkm.NeBox.add(1))
    },
    BatteryEff1(){
        let eff = Decimal.pow(413,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).max(2).sub(2))
        return eff
    },
    BatteryEff2(){
        let eff = Decimal.pow(1e100,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).pow(0.85)).mul(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).pow(4)).add(1)
        return eff
    },
    totalGrid(){
        let total = 0
        for(var i = 101; i <= 1299; i++){
            if(hasGrid('Hkm',i)) total++
        }
        return total
    },
    update(diff){
        if(tmp.Hkm.storyPending > player[this.layer].storyUnlocked) {
            player[this.layer].storyUnlocked = tmp.Hkm.storyPending;
            player[this.layer].newStory = true
            doPopup(type = "none", text = "新的 Hokma 故事解锁了!<br>(No. "+formatWhole(player[this.layer].storyUnlocked)+")", title = "命运的齿轮悄然转动...", timer = 5, color = "gray")
        }
        if(player.Hkm.storyUnlocked >= 2) player.Hkm.timeEnergy = player.Hkm.timeEnergy.add(tmp.Hkm.compressorEff.mul(diff))
        if(player.Hkm.timeEnergy.gte(tmp.Hkm.nextTimeThroem)){
            player.Hkm.timeThroem = player.Hkm.timeThroem.add(1)
            player.Hkm.totalTimeThroem = player.Hkm.totalTimeThroem.add(1)
        }
        player.Hkm.gridTime = player.Hkm.gridTime.add(diff)
        if(player.Hkm.storyUnlocked >= 6){
            player.Hkm.PeBox = player.Hkm.PeBox.add(tmp.Hkm.PeBoxGain.mul(diff))
            player.Hkm.NeBox = player.Hkm.NeBox.add(tmp.Hkm.NeBoxGain.mul(diff)).max(0)
        }
        if(player.Hkm.NeBox.gte(tmp.Hkm.NeBoxStroage)){
            player.Hkm.PeBox = n(0)
            player.Hkm.foems = player.Hkm.foems.div(2).floor()
            setBuyableAmount('Hkm','Hkm-f4',n(0))
            player.Hkm.NeBox = n(0)
        }
        if(hasAchievement('Ain','Hkm-17')) HokmaGridC[204] = 11
        if(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).gt(player.Hkm.maxBet)) player.Hkm.maxBet = getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3'))
    },
    upgrades: {
        'Hkm-1': {
            title() {return quickColor('['+this.id+']'+'<h3>柔软月光<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '精华中超越 1e300 的部分倍增 Hokma 点数获取.'},
            effect() {
                let eff = Decimal.pow(1.1,player.points.add(1).log(10).sub(300))
                if(eff.gte(1e5)) eff = softcap(eff,'root',n(1e5),2)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),25)
                return eff
            },
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Hkm.upgrades[this.layer,this.id].effect())},
            cost() {return n(3e6)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return true}
        },
        'Hkm-2': {
            title() {return quickColor('['+this.id+']'+'<h3>徜徉星海<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Kether点数 超过 1e300 的部分倍增 Hokma 点数 获取.'},
            effect() {
                let eff = Decimal.pow(1.03,player.Ktr.points.add(1).log(10).sub(300))
                if(eff.gte(1e5)) eff = softcap(eff,'root',n(1e5),2)
                if(eff.gte(1e10)) eff = softcap(eff,'root',n(1e10),25)
                return eff
            },
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            effectDisplay() {return '×'+format(layers.Hkm.upgrades[this.layer,this.id].effect())},
            cost() {return n(1e8)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-3': {
            title() {return quickColor('['+this.id+']'+'<h3>解脱之世<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '极大地提升 Hokma 点数的效果.'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e9)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-4': {
            title() {return quickColor('['+this.id+']'+'<h3>记忆的涟漪<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '精华获取 ×1e50'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e10)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-5': {
            title() {return quickColor('['+this.id+']'+'<h3>无尽天堂<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return 'Kether点数获取 ×1e50'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e19)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-6': {
            title() {return quickColor('['+this.id+']'+'<h3>星羽<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '时间冷凝器的效果变得更好。'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e23)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-7': {
            title() {return quickColor('['+this.id+']'+'<h3>星浮<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '时空网格力量倍增能量获取。'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e24)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-8': {
            title() {return quickColor('['+this.id+']'+'<h3>心上流星<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '显著地改良恒星点数的公式。'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e30)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-9': {
            title() {return quickColor('['+this.id+']'+'<h3>遥远之约<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '时空网格力量增长没有上限，并让它些微提升。'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(2e31)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-10': {
            title() {return quickColor('['+this.id+']'+'<h3>毁灭 123<br>',hasUpgrade(this.layer,this.id)?'lime':'')},
            description() {return '时间冷凝器·Z轴的价格变得更低 10000 倍。'},
            color(){return 'grey'},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost() {return n(1e38)},
            style() {
                if(!hasUpgrade(this.layer,this.id)&&!this.canAfford()){return ''}
                else if(!hasUpgrade(this.layer,this.id)&&this.canAfford()){return {'box-shadow':'inset 0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'background-color':'black', 'color':'white', 'height':'130px', 'width':'130px','border-color':this.color()}}
                else return {'background-color':this.color(), 'color':'black', 'border-color':'lime', 'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px '+this.color(), 'height':'130px', 'width':'130px'}
            },
            unlocked() {return hasUpgrade(this.layer,'Hkm-9')}
        },
    },
    storyContent: {
        1:{
            text(){ 
                let text = `<text style='color:gray; font-size: 30px; text-shadow: 2px 2px 7px gray'>When the meteor falls, the star feathers stop and fall in the lake.</text><br>
                <text style='color:gray; font-size: 30px; text-shadow: 2px 2px 7px gray'>I have never hated the seemingly approachable starry sky, the sinking illusion, like the meteor that people eagerly hope for. The meteor will not come, and my tomorrow is a deep darkness.——Hokma</text><br><br>
        		<text style='color: #999999'>[Illustration] Ain had a dream about Kether, in which she mentioned that she had buried a key in Wonderland.</text><br>
		        <text style='color: #999999'>[Illustration] When Ain woke up from her dream, she and I were riding on a wooden boat on the lake. I asked Ain where to go first, and Ain said that the clues provided by Ktr-2 pointed to Starfeather Town in the Kingdom of Niniel.</text><br>`
                if(player.Hkm.storyUnlocked < 1) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach 1 hokma point to continue.(Tips: Press the prestige button in the hokma layer to gain Kether点数. The requirement is 1e20 记忆水晶s and 1e330 恒星点数. You will LOSE ALL PROGRESS IN THE KETHER LAYER!!)</i>`
                if(player.Hkm.storyUnlocked >= 1) text += `
                <text style='color: #999999'>[Illustration] On the way by boat, the girl rowing the boat chatted with Ain, introducing that the Kingdom of Niniel is a romantic fantasy land woven from fairy tales, and each city is a place where Niniel's different fairy tales take place. Ain was curious about the fairy tale of Star Feather Town, and the boating girl replied that it was a Star Feather Swan.</text><br>
                <text style='color:magenta'>[Ain] Legend has it that Silver Moon Lake is a mirror left by the great designer Kether in the forest, which can reflect the beautiful starry sky. The true beauty is that it can summon a grand meteor shower, and the wishes made under the meteor shower will definitely come true.</text><br>
                <text style='color: #777777'>[Hokma-46] Come on, girl, come to Silver Moon Lake. Ripples are the 阶段, starry nights are the curtain~Dance, spread your wings, dreams come true, please let me accompany you~When swans dance, their wings fall into shooting stars...</text><br>
                <text style='color:magenta'>[Ain] Oh, may this be related to the design brochure that Kether-2 gave us?</text><br>
                `
                return text
            }
        },
        2:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] There is a rule in the design brochure that if creating a set of records, it 需要 the designer's inspiration to echo. Now Ain has the design inspiration for "Meteor Feather" in the album. You suggest going to the design workshop in Star Feather Town to make it. Hokma-46, a boat girl, took Ain to the shore with you and introduced her name as Ah Huan. Welcome to Star Feather Town in the future and take her boat frequently.</text><br>
                <text style='color: #999999'>[Illustration] In the design workshop, Ain held the newly made bag and longed for the power of the Sephirah Shadow summoned after the design drawings of Meteor Feather were completed. He also longed to create more design drawings in the future and have stronger Sephirah power.</text><br>
                `
                if(player.Hkm.storyUnlocked < 2) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 at least 7 achievements to continue. The more milestones 你拥有, the faster the next Hokma run will be.</i>`
                if(player.Hkm.storyUnlocked >= 2) text += `
                <text style='color: #999999'>[Illustration] Ain was pulling out his wallet to pay for the production fee when a handsome young man in gorgeous attire approached the shop owner. He made a delicate glove, but the shop owner offered it for free. The young man repeatedly thanked him, but Ain was very puzzled as to why it was free and whether there were any activities?</text><br>
                <text style='color: #999999'>[Illustration] The handsome young man blinked at Ain and left. The shop owner explained to Ain that beauty is everything in Star Feather Town, and as a member of Star Feather Town, it is natural to give preferential treatment to beautiful people. Ain found this approach unbelievable. The shop owner said that people always think that Star Feather Town is a town that places too much emphasis on beauty, and there is no need to reject human nature. Instead, it is better to give more happiness to beautiful people like Star Feather Town, as unattractive people are not suitable to be born in Star Feather Town.</text><br>
                <text style='color:magenta'>[Ain] Absurdly absurd, treating people differently based on their appearance?</text><br>
                <text style='color: #999999'>[Illustration] Ain said that no one has a way to determine their natural beauty or ugliness. The shop owner An An said that you are already very beautiful and there is no need to underestimate yourself. Ain knew the shopkeeper had misunderstood him and explained that the evaluation system of Star Feather Town was just unreasonable.</text><br>
                <text style='color: #999999'>[Illustration] Ain, who walked out of the store, looked at the fairy tale like street view of Feather Town again and had a different feeling. She found that the people walking on the street were all very beautiful. In the Feather Town of the Stars, beauty is everything. So, where have people who are not good-looking gone?</text><br>
                `
                return text
            }
        },
        3:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] Perhaps in the eyes of outsiders, Star Feather Town is pleasing and beautiful, but it makes Ain feel uncomfortable.</text><br>
                <text style='color: #999999'>[Illustration] Thinking of coming to Star Feather Town to find clues about Kether, Ain decided to first search for news about the nursery rhyme sung by Ah Huan. As for the clues about this nursery rhyme, the people in the town coincidentally mentioned a person - an old fairy tale musician who lived in the town hospital for two years.</text><br>
                <text style='color: #999999'>[Illustration] Ain arrived outside the old musician's ward, and before Ain could knock on the door, the old musician's voice had already come from inside.</text><br>
                <text style='color: #777777'>[Hokma-3] Are you Hokma-9? Come in, please.</text><br>
                `
                if(player.Hkm.storyUnlocked < 3) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 1×1 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 3) text += `
                <text style='color: #777777'>[Hokma-3] Grey Grass, came over so early today. Did you finish the housework ahead of schedule? (Grey Grass=Hokma-9, Old Musician=Hokma-3)</text><br>
                <text style='color:magenta'>[Ain] Hello Mr. Musician, I'm not Grey Grass, I'm Ain. Today is our first time visiting.</text><br>
                <text style='color: #999999'>[Illustration] The old musician still muttered to himself, seemingly immersed in the world of two people chatting with "Grey Grass". As he spoke, the old musician stood up trembling from his wheelchair, and Ain quickly stepped forward to help him.</text><br>
                <text style='color: #777777'>[Hokma-3] Meteor falling in the eye...</text><br>
                <text style='color: #999999'>[Illustration] The sound of the piano is shattered, and the singing is hoarse.</text><br>
                <text style='color: #999999'>[Illustration] The once legendary musician is now playing old songs in the hospital ward.</text><br>
                <text style='color: #999999'>[Illustration] As Ain watched the old musician immerse himself in his performance, he decided to first ask his attending physician.</text><br>
                <text style='color: #999999'>[Illustration] In the office, the attending doctor stated that the old musician has been living in the hospital since the fire at the Star Feather Swan Selection Competition two years ago.</text><br>
                <text style='color: #777777'>[Hokma-768] After the fire, he became somewhat disoriented and seemed to have no memory of what happened that day. Afterwards, he gradually developed Alzheimer's disease and his heart has been struggling.</text><br>
                `
                return text
            }
        },
        4:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] For the gray gray grass that the old musician often talks about, no one in the hospital knows who she is. Ain wondered why gray grass had not visited the old musician. The doctor didn't say anything, but only said that the old musician didn't have many relatives, and the medical expenses were always paid by the town band.</text><br>
                <text style='color: #999999'>[Illustration] The clue seems to have broken, "I" suggested going back to the ark to ask Kether-2, perhaps there is some way. But a phone call suddenly ringing!</text><br>
                <text style='color:white'>[Kether-9718] Hello, Ain? Do you remember what I told you about my friend who was collecting designer information? Her name is Vivian and she is a journalist. She is doing a column interview about design and needs help. Are you interested?</text><br>
                <text style='color:white'>[Kether-9718] This column is called the Designer Intelligence Room, which allows you to 获得 in touch with different designers through interviews, and you can also 获得 a lot of non circulating design collectibles on the market.</text><br>
                <text style='color:magenta'>[Ain] That's settled then.</text><br>
                <text style='color: #999999'>[Illustration] Returning to the Sea of Memory, Ain found Kether-2, indicating the situation where the nursery rhyme clues were broken.</text><br>
                <text style='color: #999999'>[Illustration] Kether-2 opened his portable notebook and retrieved Ain's experience in the Miracle Continent. Ain was very surprised by his abilities in this notebook.</text><br>
                <text style='color:white'>[Kether-2] The clue to nursery rhymes was found in the information of a Sephirah Shadow, and you may be interested in its name.</text><br>
                <text style='color:magenta'>[Ain] The name is?</text><br>
                <text style='color:white'>[Kether-2] Hokma-9!</text><br>
                <text style='color:white'>[Kether-2] In each mirror of the ark, there is a Sephirah, and during battles, you use the power of the Sephirah Shadow in the mirror.</text><br>
                `
                if(player.Hkm.storyUnlocked < 4) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 2×2 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 4) text += `
                <text style='color:white'>[Kether-2] This mirror is the Sephirah Shadow of Grey Grass and Meteor Feather, and due to incomplete production, the mirror is not complete.</text><br>
                <text style='color: #999999'>[Illustration] On the incomplete mirror, the sharp gaze of Grey Grass was revealed, which was a suppressed desire under the gaze.</text><br>
                <text style='color: #999999'>[Illustration] Facing the gaze of Grey Grass, some images suddenly flashed in Ain's mind, and the real feeling made Ain grip his hands tightly.</text><br>
                `
                return text
            }
        },
        5:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] When Ain came to his senses, he was already in a sea of fire. In the midst of the sea of fire, there stood an indistinct gray figure in the distance.</text><br>
                <text style='color:magenta'>[Ain] Who are you? Where is this?</text><br>
                <text style='color: #777777'>[Hokma-9] Meteor falling in the eye...</text><br>
                <text style='color: #777777'>[Hokma-9] It's the person you awakened.</text><br>
                <text style='color:magenta'>[Ain] Grey grass?</text><br>
                <text style='color:white'>[?????] Grey grass has already died, and next, it's you!</text><br>
                <text style='color:pink'>[You] Use the power of Sephirah's Shadow quickly!</text><br>
                <text style='color: #999999'>[Illustration] The power of Sephirah's shadow emerged in the warm heart, and the sea of fire gradually faded away, leaving Ain alone on the empty lakeshore.</text><br>
                <text style='color:magenta'>[Ain] Where is that mysterious girl?</text><br>
                <text style='color:magenta'>[Ain] What about that mysterious girl? So what I just saw was the designer's memory when designing this outfit?</text><br>
                <text style='color:white'>[Kether-2] Every piece of clothing is a condensation of designer emotions and memories, which give birth to Sephirah's shadow in the reflection of the sea of memories.</text><br>
                <text style='color:white'>[Kether-2] Sephirah Shadow only possesses the emotions and memories of the designer at the time, as these emotions are too intense. When using the power of Sephirah Shadow, be careful not to be backfired.</text><br>
                <text style='color: #999999'>[Illustration] Ain thought for a moment, and only by summoning the Sephirah Shadow of Grey Grass can he know the truth about that memory. Only in this way can we know the relationship between nursery rhymes and Kether.</text><br>
                `
                if(player.Hkm.storyUnlocked < 5) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your Time-Space grid to 3×3 to continue.</i>`
                if(player.Hkm.storyUnlocked >= 5) text += `
                <text style='color: #999999'>[Illustration] Ain and his group met Ah Huan by chance, and Ah Huan invited them to experience a ferry tour around the lake. Ain politely declined, citing that he had something else to do.</text><br>
                <text style='color: #999999'>[Illustration] Ah Huan was a bit curious, so Ain asked her if she had seen the Meteor Feather outfit before and showed her the picture.</text><br>
                `
                return text
            }
        },
        6:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] Ahuan recognized Meteor Feather at a glance and said that even if I were to die, I wouldn't for获得 this outfit because the story about Meteor Feather couldn't be finished for a while. So Ahuan invited Ain and his team to board the ship and slowly told the story behind Meteor Feather.</text><br>
                <text style='color: #999999'>[Illustration] Regarding the memory of Meteor Feather, Ah Huan said that she saw it during the promotion competition of the previous Star Feather Swan Selection Competition, shining brilliantly between the starry sky and the reflection.</text><br>
                <text style='color: #999999'>[Illustration] Ain heard Ah Huan mention the Star Feather Swan Selection Competition, and it seems to have been heard somewhere in his memory. At this point, Ah Huan and Ain had already arrived at the 阶段 of Star Feather Swan Selection, as there were no activities tonight and the 阶段 was quiet.</text><br>
                <text style='color: #777777'>[Hokma-768] This is the biennial election competition in the town, where the most beautiful girl is awarded the title of "Star Feather Swan". Although Xingyu Town is small, the selection of Xingyu Swan is a grand event that attracts nationwide attention.</text><br>
                <text style='color: #777777'>[Hokma-768] The queen of Niniel, the queen whom I will always respect and aspire to, Lilith, left two years ago after winning the championship.</text><br>
                <text style='color:magenta'>[Ain] What, isn't the queen hereditary?</text><br>
                <text style='color: #777777'>[Hokma-768] The monarch of Niniel was elected - the person believed by the people of the whole country to best fit Niniel's temperament.</text><br>
                <text style='color:magenta'>[Ain] So the queen is the most beautiful girl chosen by everyone in the country?</text><br>
                <text style='color: #777777'>[Hokma-768] Yes, tomorrow is the selection of the Star Feather Swan, and this year's competition will be even more grand.</text><br>
                <text style='color:magenta'>[Ain] The values of this country are truly extreme and terrifying.</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, I also want to sign up to participate. Can you accompany me to compete on 阶段 once? The theme is my favorite "Nick of time"!</text><br>
                `
                if(player.Hkm.storyUnlocked < 6) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 Time foem to continue.</i>`
                if(player.Hkm.storyUnlocked >= 6) text += `
                <text style='color: #999999'>[Illustration] Ain awakened Sephirah's power and put on the headgear of Meteor Feather - Star Feather.</text><br>
                <text style='color: #999999'>[Illustration] At this moment, Ah Huan was not aware of the seriousness of the problem, and the all-out Ain made Ah Huan feel the power of matching and was rubbed against the ground.</text><br>
                `
                return text
            }
        },
        7:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] After the match, Ah Huan suggested that Ain participate in the Star Feather Swan selection tomorrow, thinking that this competition should be able to see different matching artists and designers, especially since Meteor Feather's outfit has shone on 阶段, she readily agreed.</text><br>
                <text style='color: #777777'>[Hokma-768] After the players of Meteor Feather left, thick smoke drifted from the back阶段.</text><br>
                <text style='color:magenta'>[Ain] Is it the fire where the old musician was injured?</text><br>
                <text style='color: #777777'>[Hokma-768] That fire was indeed quite bizarre. Everyone thought that the girl wearing Meteor Feather would win the championship, but unfortunately.</text><br>
                <text style='color:magenta'>[Ain] How...?</text><br>
                <text style='color: #777777'>[Hokma-768] Disfigured by the fire.</text><br>
                <text style='color:magenta'>[Ain] Is it gray grass?</text><br>
                <text style='color: #777777'>[Hokma-768] It doesn't seem like that name, but many girls participate in competitions to enter the entertainment and fashion circles, perhaps using 阶段 names.</text><br>
                <text style='color:magenta'>[Ain] So what happened to her afterwards?</text><br>
                <text style='color: #777777'>[Hokma-768] Having suffered a great blow, living an ugly life in the small town is a terrible ending. I have seen a girl who always wears a mask when going out, has no friends, and is often bullied. I always felt sorry for her until I accidentally saw her face. I understood the reason why she was treated this way, and I was scared.</text><br>
                <text style='color:pink'>[You] Why can't we have more sympathy for that girl? She must be in a lot of pain.</text><br>
                <text style='color:magenta'>[Ain] Is beauty and ugliness really important? Isn't the meaning of pairing existence to enable all those who aspire to shine to realize themselves?</text><br>
                `
                if(player.Hkm.storyUnlocked < 7) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 Time foem constructor to continue.</i>`
                if(player.Hkm.storyUnlocked >= 7) text += `
                <text style='color: #777777'>[Hokma-768] If you are so interested in that fire, you can go to the police station to inquire, maybe the case record is still kept.</text><br>
                <text style='color:magenta'>[Ain] Let's go now!</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, it's too late now. The police station cannot accept your request.</text><br>
                <text style='color:magenta'>[Ain] I forgot it...</text><br>
                `
                return text
            }
        },
        8:{
            text(){ 
                let text = `
                <text style='color: #777777'>[Hokma-768] Let's take you to the hotel first and ask tomorrow morning?</text><br>
                <text style='color:magenta'>[Ain] Thank you.</text><br>
                <text style='color: #777777'>[Hokma-768] It's not a big deal. Competing with your memory has helped me find a direction for improvement and allowed me to experience the shadow of Sephirah. Tomorrow, I will confidently participate in the competition.</text><br>
                <text style='color: #999999'>[Illustration] The second day.</text><br>
                <text style='color: #999999'>[Illustration] Ain came to the police station as a fan of Meteor Feather to learn about the aftermath of the fire and the current situation of Grey Grass.</text><br>
                <text style='color: #777777'>[Hokma-3200] Grey Grass is an arsonist, but how do you know about her? When reporting, she used an alias.</text><br>
                <text style='color: #999999'>[Illustration] Ain is scared.</text><br>
                <text style='color: #777777'>[Hokma-3200] I personally participated in the investigation, and I remember correctly that Grey Grey Grass was the arsonist who died in the fire. I want to know now, what is your relationship with her?</text><br>
                <text style='color:magenta'>[Ain] How could it be? The Meteor Feather is clearly designed by Grey Grass.</text><br>
                <text style='color: #777777'>[Hokma-3200] Don't you believe it? Come into the archives, I can show you something.</text><br>
                <text style='color: #999999'>[Illustration] The police (Hokma-3200) showed them a video of Pepe dancing screaming while covering her disfigured face.</text><br>
                <text style='color: #999999'>[Illustration] The warmth and big cat in front of the TV were stunned. No matter who the arsonist was, such a crime was terrifying. At this moment, the police handed over another photo.</text><br>
                `
                if(player.Hkm.storyUnlocked < 8) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 the second pack of Kether upgrades to continue.</i>`
                if(player.Hkm.storyUnlocked >= 8) text += `
                <text style='color:magenta'>[Ain] Perhaps because she was too ugly, she was abandoned by her biological parents and became an adopted daughter. Because she was jealous of her sister's beauty, she committed such a crime.</text><br>
                <text style='color: #777777'>[Hokma-3200] Many people say that dying in this fire was really cheap for her. That's not what I said, don't go out and talk nonsense.</text><br>
                <text style='color:magenta'>[Ain] Thanks, I got it.</text><br>
                <text style='color:magenta'>[Ain] Perhaps the whole thing is not so simple. Let's go to the hospital again to see the old musician.</text><br>
                `
                return text
            }
        },
        9:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] Old musician, are you okay?</text><br>
                <text style='color: #777777'>[Hokma-3] Grey grass, you come there again!</text><br>
                <text style='color:magenta'>[Ain] I go there to see you. Old musician, do you still remember the outfit I designed?</text><br>
                <text style='color: #777777'>[Hokma-3] Remember, how did the beautiful clothes go?</text><br>
                <text style='color:magenta'>[Ain] We still need some materials, it's almost finished.</text><br>
                <text style='color: #777777'>[Hokma-3] Well, when standing on 阶段, I will accompany you.</text><br>
                <text style='color:magenta'>[Ain] Thank you Do I sing well?</text><br>
                <text style='color: #777777'>[Hokma-3] It sounds great, you need to be confident. True beauty is not just about appearance, but also about sticking to your heart. No matter what others say, in my eyes you are very cute. Stand on that 阶段, put on the clothes you designed yourself, sing that song, and summon that meteor shower.</text><br>
                <text style='color: #999999'>[Illustration] The words of the old musician seem so out of place in Xingyu Town, where beauty is everything.</text><br>
                <text style='color: #777777'>[Hokma-3] Go ahead! Meteor showers will definitely fall!</text><br>
                <text style='color:pink'>[You] Ain, let's go back to the ark and see the gray grass. She must be very lonely.</text><br>
                `
                if(player.Hkm.storyUnlocked < 9) text += `<br><br>
                <i style='color: #444444'>[Locked] Expand your time-space grid to 4×4 to unlock.</i>`
                if(player.Hkm.storyUnlocked >= 9) text += `
                <text style='color:magenta'>[Ain] Go back to the ark and see the gray grass? The mirror hasn't been assembled yet, has it?</text><br>
                <text style='color:pink'>[You] Well, let's go back. I do have something I want to say to Grey Grass.</text><br>
                <text style='color: #999999'>[Illustration] The Ark of the Sea of Memory, in front of the Sephirah Shadow of Grey Grass</text><br>
                <text style='color:magenta'>[Ain] Grey Grass, perhaps 你拥有 indeed committed an unforgivable mistake. I can feel your emotions and see those vague memory fragments, but is this ending what you want now?</text><br>
                <text style='color: #777777'>[Hokma-9] Those who mock you will not change, and your pain will not end.</text><br>
                <text style='color: #999999'>[Illustration] Ain reached out and lightly touched the mirror, causing ripples to spread on the surface without a cold touch. It was like a flame burning and jumping.</text><br>
                `
                return text
            }
        },
        10:{
            text(){ 
                let text = `
                <text style='color: #999999'>[Illustration] A figure intertwined with anger and sadness appeared in the dimly lit mirror, rushing towards Ain with a roaring flames and rolling her inside.</text><br>
                <text style='color:pink'>[You] Ain!</text><br>
                <text style='color:magenta'>[Ain] Grey Grass, you...</text><br>
                <text style='color:pink'>[You] Ain! Don't be devoured by the power of Sephirah's shadow, engage in a memory war with her!</text><br>
                <text style='color:magenta'>[Ain] Grey grass, your pain cannot dominate me!!</text><br>
                `
                if(player.Hkm.storyUnlocked < 10) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 eternal battery to continue.</i>`
                if(player.Hkm.storyUnlocked >= 10) text += `
                <text style='color: #999999'>[Illustration] The 阶段 that Grey Grass once dreamed of was burning with blazing flames, people scattered and fled, and Pepe stood trembling in fear in the sea of fire.</text><br>
                <text style='color: #999999'>[Illustration] Grey grass held its head high, naked in the flames, like a queen patrolling her own territory.</text><br>
                <text style='color: #777777'>[Hokma-9] If evil is beautiful, why don't I become a demon?</text><br>
                <text style='color:magenta'>[Ain] Pain cannot be burned.</text><br>
                <text style='color: #777777'>[Hokma-9] Don't think you can understand me, leave my memories!</text><br>
                <text style='color: #999999'>[Illustration] The gray grass was infuriated, and the flames were swept by the strong wind towards Ain.</text><br>
                <text style='color: #999999'>[Illustration] The firelight drifted away, and Ain returned to the ark.</text><br>
                <text style='color: #999999'>[Illustration] Ain looked at the quiet mirror, knowing that the raging fire had been burning in the heart of Grey Grass.</text><br>
                <text style='color:pink'>[You] Grey grass seems to have enclosed itself in the fire, refusing everyone's approach.</text><br>
                <text style='color:magenta'>[Ain] The flame will eventually go out, as long as the meteor shower falls.</text><br>
                <text style='color:pink'>[You] If a true meteor shower were summoned in front of the gray grass, perhaps it could extinguish the flame in her heart?</text><br>
                <text style='color:magenta'>[Ain] Well, I think so too. I have to give it a try no matter what. I have all the inspiration, let's go call for the meteor shower together.</text><br>
                <text style='color: #999999'>[Illustration] On site registration.</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, you come here!</text><br>
                `
                return text
            }
        },
        11:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] Congratulations, Ah Huan!</text><br>
                <text style='color: #777777'>[Hokma-768] The selection competition is still easy to pass, and I'm worried if you won't come.</text><br>
                <text style='color:magenta'>[Ain] Sorry, it was delayed by some things.</text><br>
                <text style='color:pink'>[You] A lot of things happened today, it's almost dark in the blink of an eye.</text><br>
                <text style='color: #999999'>[Illustration] At this moment, the broadcast on the square announced that the Star Feather Swan selection qualification competition was about to end. Ain panicked and went to register, but was refused by the judges on the grounds that the selection competition had already ended.</text><br>
                <text style='color:magenta'>[Ain] But the registration will only end in 5 minutes.</text><br>
                `
                if(player.Hkm.storyUnlocked < 11) text += `<br><br>
                <i style='color: #444444'>[Locked] 解锁 fuel battery to continue.</i>`
                if(player.Hkm.storyUnlocked >= 11) text += `
                <text style='color: #777777'>[Hokma-768] Give us a chance, this game is very important to us.</text><br>
                <text style='color: #777777'>[Hokma] Why didn't you come earlier? Is it okay to take responsibility for oneself? Do you want me to set an alarm for you? Go back!</text><br>
                <text style='color: #777777'>[Hokma-768] But in previous years, there were additional spots added after the selection competition ended? Even the queen who participated in the last competition was only after the semi-finals——</text><br>
                <text style='color: #777777'>[Hokma] What is the queen and who are you? The special channel is only open to beautiful people. You, like those girls on the street, have an ordinary appearance. It's not wrong to be ordinary, but it's your fault to have privileges despite your ordinary appearance!</text><br>
                <text style='color:magenta'>[Ain] Are the judges of Star Feather Swan using this standard of evaluation?</text><br>
                <text style='color: #777777'>[Hokma] What, do 你拥有 any objections?</text><br>
                <text style='color:magenta'>[Ain] The standard of beauty is not absolute.</text><br>
                <text style='color: #777777'>[Hokma] You actually insulted the judges and slandered the competition at the scene.</text><br>
                <text style='color:magenta'>[Ain] Didn't you just say that the game has ended?</text><br>
                <text style='color: #777777'>[Hokma] The shameless little girl, let me teach you a lesson. You can decide the theme of the memory competition.</text><br>
                <text style='color: #999999'>[Illustration] Ah Huan panicked and quickly told Ain that this judge is a well-known senior matchmaker in the Sephirah Alliance, specifically responsible for commenting on the matching of contestants in the competition.</text><br>
                `
                return text
            }
        },
        12:{
            text(){ 
                let text = `
                <text style='color:magenta'>[Ain] It's okay, I don't believe that someone with such a superficial understanding of Sephirah would have such strong memory power.</text><br>
                <text style='color:magenta'>[Ain] So, let's set the theme as "highly respected judges".</text><br>
                <text style='color: #777777'>[Hokma] Oh, I actually set a theme that I'm good at, arrogant!</text><br>
                `
                if(player.Hkm.storyUnlocked < 12) text += `<br><br>
                <i style='color: #444444'>[Locked] Reach the first softcap of Hokma 点数 gain to unlock.</i>`
                if(player.Hkm.storyUnlocked >= 12) text += `
                <text style='color: #999999'>[Illustration] At this point, the judges had not yet realized the seriousness of the problem, and the battle had already ended at the beginning. He was rubbed against the ground by Ain's force.</text><br>
                <text style='color: #999999'>[The Judge] I actually lost? impossible!</text><br>
                <text style='color: #777777'>[Hokma-768] Ain, you're so powerful!</text><br>
                <text style='color: magenta'>[Ain] The 阶段 of the Star Feather Swan is a place where every girl shines, even if she hasn't become a 'Star Feather Swan', she can show everyone her shining points. Even so, my understanding of beauty is still shallow, but it cannot bring hope and beauty to people, and cannot be called true beauty.</text><br>
                <text style='color: #999999'>[Illustration] The judge looked at the suddenly serious Ain, speechless. At this moment, Ain's phone suddenly rang.</text><br>
                <text style='color: #999999'>[Illustration] "Hello, um, it was me who went to visit the old musician this afternoon. What? I'll be right there! "Ain was surprised, and the other end of the phone told her that the old musician had a sudden heart attack and was currently receiving emergency treatment!</text><br>
                `
                if(player.Hkm.storyUnlocked < 13) text += `<br><br>
                <i style='color: #444444'>[Locked] Congratulations! 你拥有 reached the current endgame of vHkm.Hcl.9.</i>`
                return text
            }
        },
    },
    bars: {
        'Hkm-t1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Hkm.timeEnergy)+' / '+formatWhole(tmp.Hkm.nextTimeThroem)+' 时间能量到下一个时间定理'},
            progress() { return player.Hkm.timeEnergy.div(tmp.Hkm.nextTimeThroem) },
            borderStyle() { return {'border-color':'grey'}},
            fillStyle() { return {'background-color':'grey'}},
        },
        'Hkm-f1': {
            direction: RIGHT,
            width: 600,
            height: 30,
            display() { return formatWhole(player.Hkm.NeBox)+' / '+formatWhole(tmp.Hkm.NeBoxStroage)+' 直到逆流毁灭'},
            progress() { return player.Hkm.NeBox.div(tmp.Hkm.NeBoxStroage) },
            borderStyle() { return {'border-color':'salmon'}},
            fillStyle() { return {'background-color':'salmon'}},
        },
    },
    milestones: {
        'Hkm-1': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.自动购买所有基础恒星，并免费获得一个黄矮星.<br>2.解锁心灵通道时将立刻将它稳定化。<br>`+quickColor("3.解锁 Ain (成就).",'pink')},
            req: n(1),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return true}
        },
        'Hkm-2': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Hokma 重置时保持 Kether 升级.`},
            req: n(2),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-3': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.如果可能，自动购买方舟。`},
            req: n(3),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-4': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.自动购买时光钟表铺中的资源，并且它们无花费。`},
            req: n(4),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-5': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.自动提升宇宙层级。`},
            req: n(6),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-6': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.黑洞速度被锁定为 1000× 并且你无法再获得反物质。`},
            req: n(9),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-7': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.在 Hokma 重置时保留记忆水晶.`},
            req: n(18),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-8': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.方舟在 Hokma 重置后立即进入极远星空.`},
            req: n(100),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-9': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.自动购买 Ktr-s-d2 和 Ktr-s-d3.<br>2.解锁新的 Kether 故事不再弹出提示.`},
            req: n(500),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-'+Number(this.id[4]-1))}
        },
        'Hkm-10': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.自动购买剩余恒星.`},
            req: n(1000),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-9')}
        },
        'Hkm-11': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.Kether的回忆深度一直在 100 层。`},
            req: n(2500),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-12': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.在 Hokma 重置中保留全部方舟及有关升级。`},
            req: n(5000),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-13': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.扩展时空网格.(0×0 → 1×1)`},
            req: n(1e13),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-14': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.扩展时空网格.(1×1 → 2×2)`},
            req: n(1e20),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-15': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.扩展时空网格.(2×2 → 3×3)`},
            req: n(1e32),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-16': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.解锁时空泡沫.`},
            req: n(1e42),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-17': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.扩展时空网格.(3×3 → 4×4)`},
            req: n(1e63),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-18': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.解锁燃料电池.(在永恒电池选项卡下。)`},
            req: n(1e136),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
        'Hkm-19': {
            requirementDescription() {return quickColor("获得 "+formatWhole(this.req)+" Hokma 点数 ("+formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100).min(100))+"%)",hasMilestone(this.layer,this.id)?'green':'')},
            effectDescription(){ return `———————————————————————————————————————————<br>1.扩展时空网格.(4×4 → 5×5)<br>2.四阶时间方盒获取提升到250%.<br>3.Hokma 点数获取受到一重软上限限制.(敬请期待)`},
            req: n(1e150),
            done() { return player.Hkm.points.gte(this.req) },
            style() {
                if(!hasMilestone(this.layer,this.id)){ return {'height':'100px','max-width':'700px','background':`linear-gradient(to right,#999999 ${formatWhole(n(player.Hkm.points).div(tmp.Hkm.milestones[this.id].req).mul(100))}%,grey ${formatWhole(player.Hkm.points.div(tmp.Hkm.milestones[this.id].req).mul(100))}%)`,'border-radius':'5px'}}
                else return {'background': `repeating-linear-gradient(90deg, #444444 0, #444444 1px, #001700 0,#001700 70px)`,'background-size':'70px','color':'white','height':'100px','max-width':'700px','box-shadow':`0px 0px 4px ${player.timePlayed%2+5}px #444444`}
            },
            unlocked() {return hasMilestone(this.layer,'Hkm-1'+Number(this.id[5]-1))}
        },
    },

    layerShown() { return player.Ktr.memoryCrystal.gte(1e20) || player.Hkm.storyUnlocked >= 1 },          // Returns a bool for if this layer's node should be visible in the tree.
    grid: {
        rows(){return tmp.Hkm.gridSize}, // If these are dynamic make sure to have a max value as well!
        cols(){return tmp.Hkm.gridSize}, 
        maxRows: 12,
        maxCols: 12,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return player.Hkm.timeThroem.gte(HokmaGridC[id]) && data != 1
        },
        getTooltip(data, id){
            let color = HokmaColor[id % 100]
            return "<h4 style='color:"+color+";text-shadow:0px 0px 10px;'>["+HokmaGridFullProfix[id % 100]+(Math.floor(id / 100))+"]<h4><h4>效果： "+HokmaGridDesc[id]+"<br>当前： "+getProfix(data, id)+format(getEffect(data, id))
        },
        onClick(data, id) {
            player.Hkm.timeThroem = player.Hkm.timeThroem.sub(HokmaGridC[id])
            player[this.layer].grid[id]++
        },
        getDisplay(data, id) {
            return '<h1 style="font-size:25px">'+HokmaGridProfix[id % 100]+(Math.floor(id / 100))+"<h3><br><br>花费： "+HokmaGridC[id]+' 时间之理'
        },
        getStyle(data, id){
            let color = HokmaColor[id % 100]
            if (data <= 0) return {'background-color': "#000000",   color: "white", 'border-color': color,'border-radius': "5px", height: "100px", width: "100px"}
            else return {'background-color': color,   color: "white", 'border-color': color,'border-radius': "5px", height: "100px", width: "100px"}
        },
    },
    buyables:{
        'Hkm-t1': {
            title() {return '<h3>[Hkm-t1] X轴·时空冷凝器<br>'},
            display() {return '建造一个新的时空冷凝器.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" Hokma 点数"},
            canAfford() {return player.Hkm.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(100),Decimal.pow(x,1.2)).mul(10000)
                return cost
            },
            buy(){
                player.Hkm.points = player.Hkm.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-t2': {
            title() {return '<h3>[Hkm-t2] Y轴·时空冷凝器<br>'},
            display() {return '建造一个新的时空冷凝器.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" Kether点数"},
            canAfford() {return player.Ktr.points.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(1e8),Decimal.pow(4,x)).mul('1e340')
                if(hasAchievement('Ain','Hkm-15')) cost = Decimal.pow(n(1e10),Decimal.pow(x,2)).mul('1e340')
                return cost
            },
            buy(){
                player.Ktr.points = player.Ktr.points.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-t3': {
            title() {return '<h3>[Hkm-t3] Z轴·时空冷凝器<br>'},
            display() {return '建造一个新的时空冷凝器.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>花费： "+format(this.cost())+" 记忆水晶"},
            canAfford() {return player.Ktr.memoryCrystal.gte(this.cost())},
            cost(x){
                let cost = Decimal.pow(n(10),Decimal.pow(x,1.1)).mul(1e24)
                if(hasUpgrade('Hkm','Hkm-10')) cost = cost.div(10000)
                return cost
            },
            buy(){
                player.Ktr.memoryCrystal = player.Ktr.memoryCrystal.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'silver'}}
                else return {'background-color':'grey', 'color':'black','border-color':'silver','box-shadow':'inset 3px 3px 3px #aaaaaa,0px 0px 10px grey'}
            }
        },
        'Hkm-f1': {
            title() {return '<h3>[Hkm-f1] 毫米·泡沫<br>'},
            display() {return '降低下个方舟的需求。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：/"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(1e85,Decimal.pow(x,0.8))
                return eff
            },
            cost(x){
                if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(100)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px cyan','height':'150px'}
            }
        },
        'Hkm-f2': {
            title() {return '<h3>[Hkm-f2] 微米·泡沫<br>'},
            display() {return '提升时空网格力量。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+format(this.effect().mul(100))+"%<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.div(x,100)
                return eff
            },
            cost(x){
                if (x.gte(20)) x = x.pow(x.div(20))
				let cost = Decimal.pow(15, x).mul(200)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px cyan','height':'150px'}
            }
        },
        'Hkm-f3': {
            title() {return '<h3>[Hkm-f3] 纳米·泡沫<br>'},
            display() {return '提升太阳能获取。<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(6e8,Decimal.pow(x,0.95))
                return eff
            },
            cost(x){
                if (x.gte(20)) x = x.pow(x.div(20))
				let cost = Decimal.pow(150, x).mul(1000)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
                return cost
            },
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px cyan','height':'150px'}
            }
        },
        'Hkm-f4': {
            title() {return '<h3>[Hkm-f4] 皮米·泡沫<br>'},
            display() {return '转化获得时间方盒·顺流的速率加快.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：×"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            effect(x){
                let eff = Decimal.pow(1.35,x)
                return eff
            },
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(1000)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
            buy(){
                player.Hkm.PeBox = player.Hkm.PeBox.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'turquoise','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,aqua 0px,aqua 40px,turquoise 40px,turquoise 80px)', 'color':'black','border-color':'turquoise','box-shadow':'inset 3px 3px 3px aqua,0px 0px 10px cyan','height':'150px'}
            }
        },
        'Hkm-f5': {
            title() {return '<h3>[Hkm-f5] 飞米·泡沫<br>'},
            display() {return '让时间方盒·顺流的效果变得更好.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： ^"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间能量"},
            canAfford() {return player.Hkm.timeEnergy.gte(this.cost())},
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e6, x).mul(1e29)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
            effect(x) {
				let eff = x.mul(0.4).add(1).cbrt().min(1.60)
				return eff;
			},
            buy(){
                player.Hkm.timeEnergy = player.Hkm.timeEnergy.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,gold 0px,gold 40px,yellow 40px,yellow 80px)', 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow','height':'150px'}
            }
        },
        'Hkm-f6': {
            title() {return '<h3>[Hkm-f6] 阿米·泡沫<br>'},
            display() {return '降低时间方盒·逆流的负面效果.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： ^"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间能量"},
            canAfford() {return player.Hkm.timeEnergy.gte(this.cost())},
            cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e10, x).mul(1e40)
                if(player.Hkm.storyUnlocked >= 10) cost = cost.div(tmp.Hkm.BatteryEff1)
				return cost.floor()
			},
			effect(x) {
				let eff = x.mul(0.02).add(1).recip()
				return eff;
			},
            buy(){
                player.Hkm.timeEnergy = player.Hkm.timeEnergy.sub(this.cost())
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            unlocked(){
                return hasAchievement('Ain','Hkm-14')
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold','height':'150px'}}
                else return {'background': 'repeating-linear-gradient(45deg,gold 0px,gold 40px,yellow 40px,yellow 80px)', 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow','height':'150px'}
            }
        },
        'Hkm-b1': {
            title() {return '<h3>[Hkm-b1] 电池 Mk.1EZ<br>'},
            display() {return '时间方盒·顺流的指数和时空泡沫第二效果的指数均增加 0.1<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： +"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4'))
			},
			effect(x) {
                if(x.gte(3)) x = softcap(x,'root',n(3),3)
				let eff = x.mul(0.1)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-b2': {
            title() {return '<h3>[Hkm-b2] 电池 Mk.2HD<br>'},
            display() {return '平方逆流毁灭的阈值.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果： ^"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4'))
			},
			effect(x) {
				let eff = Decimal.pow(2,x)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-b3': {
            title() {return '<h3>[Hkm-b3] Battery Mk.3IN<br>'},
            display() {return '降低 时间方盒·逆流 负面效果的指数.<br><br>数量： '+getBuyableAmount(this.layer,this.id)+"<br>效果：/"+format(this.effect())+"<br>花费： "+format(this.cost())+" 时间方盒·顺流"},
            canAfford() {return player.Hkm.PeBox.gte(this.cost())},
            cost(x) {
				return Decimal.pow(1e4,getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3')).sub(2).max(0).pow(1.05)).mul(1e7).max(1e7).div(buyableEffect('Hkm','Hkm-fb-1-4'))
			},
			effect(x) {
				let eff = Decimal.pow(1e3,Decimal.pow(3,x)).div(1000)
                return eff
			},
            buy(){
                batteryReset()
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                if(!this.canAfford()){return {'background-color':'black', 'color':'white','border-color':'gold'}}
                else return {'background': GlowingColor('#ffaa00',10,'#ffdd00'), 'color':'black','border-color':'gold','box-shadow':'inset 3px 3px 3px gold,0px 0px 10px yellow'}
            }
        },
        'Hkm-fb-1-4': {
            title() {return '煤炭电池 Ft.Pst1<br>'},
            display() {return "降低下一个永恒电池的需求 /"+format(this.effect())+''},
            canAfford() {return false},
            cost(x) {
				return Decimal.pow(2,x).mul(10)
			},
			effect(x) {
				let eff = Decimal.pow(9,x)
                return eff
			},
            buy(){
                setBuyableAmount(this.layer,this.id,getBuyableAmount(this.layer,this.id).add(1))
            },
            style() {
                return {'background': GlowingColor('#444444',10,'#666666'),'height':'80px','width':'200px','color':'white','border-color':GlowingColor('#444444',10,'#666666'),'font-size':'10px','border-radius':'0px'}
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            },
        },
    },
    clickables:{
        'Hkm-tr1':{
            title() {return "洗点"},
            display() {return "重置时空网格的全部节点并取回所有的时间之理。"},
            canClick() {return true},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px grey', 'background': `repeating-linear-gradient(90deg, grey 0, grey 1px, black 0, black 100px)`,"background-position":player.timePlayed%10+'% '+player.timePlayed%10+"%",'background-size':`1000% 1000%`, 'color':'white', 'height':'150px', 'width':'200px','border-radius':'5px','font-size':'13px','margin-left':'5px' }
                else return {'height':'150px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'lavender','margin-left':'5px'}
            },
            onClick() {
                for (id in player.Hkm.grid){
                    player.Hkm.grid[id] = 0
                }
                player.Hkm.timeThroem = player.Hkm.totalTimeThroem.sub(player.Hkm.batteryThroem)
                player.Hkm.gridTime = n(0)
            },
            unlocked(){return hasMilestone('Hkm','Hkm-13')}
        },
        'Hkm-f1':{
            title() {return "获得 +1 时空泡沫"},
            display() {return "<br>需要 "+format(tmp.Hkm.foemReq)+" 时间能量. <br>重置并获得时空泡沫会重置你的时间能量。"},
            canClick() {return player.Hkm.timeEnergy.gte(tmp.Hkm.foemReq)},
            style(){
                if(this.canClick()) return {'box-shadow':'0px 0px 5px '+(player.timePlayed%2+5)+'px inset #444','background-color':`black`, 'color':'white', 'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','margin-left':'5px','border-color':'#444'}
                else return {'height':'150px', 'width':'300px','border-radius':'5px','font-size':'13px','background-color':'gray','color':'black','border-color':'#444','margin-left':'5px'}
            },
            onClick() {
                player.Hkm.foems = player.Hkm.foems.add(1)
                player.Hkm.timeEnergy = n(0)
            },
        },
        'Hkm-b1':{
            title() {return "摧毁1个"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b1').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b1',getBuyableAmount('Hkm','Hkm-b1').sub(1))
            },
        },
        'Hkm-b2':{
            title() {return "摧毁1个"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b2').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b2',getBuyableAmount('Hkm','Hkm-b2').sub(1))
            },
        },
        'Hkm-b3':{
            title() {return "摧毁1个"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b3').gte(1)},
            style(){
                if(this.canClick()) return {'background': `gold`, 'color':'black', 'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','border-color':'yellow'}
                else return {'min-height':'50px', 'width':'200px','border-radius':'5px','font-size':'13px','background-color':'black','color':'white','border-color':'yellow'}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
        },
        'Hkm-fb-1-1':{
            title() {return "▼"},
            canClick() {return getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').sub(1))
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
        'Hkm-fb-1-2':{
            title() {return "第 "+getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1)+" 代<br>改良花费： "+formatWhole(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)+" 时间之理"},
            canClick() {return getBuyableAmount('Hkm','Hkm-b3').gte(1)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'200px','border-radius':'0px','font-size':'10px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                setBuyableAmount('Hkm','Hkm-b3',getBuyableAmount('Hkm','Hkm-b3').sub(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
        'Hkm-fb-1-3':{
            title() {return "▲"},
            canClick() {return player.Hkm.timeThroem.gte(tmp.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost)},
            style(){
                if(this.canClick()) return {'background': GlowingColor('#444444',10,'#666666'), 'color':'white', 'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','border-color':GlowingColor('#333333',10,'#555555')}
                else return {'min-height':'80px', 'width':'80px','border-radius':'0px','font-size':'13px','background-color':'black','color':GlowingColor('#444444',10,'#666666'),'border-color':GlowingColor('#333333',10,'#555555')}
            },
            onClick() {
                player.Hkm.batteryThroem = player.Hkm.batteryThroem.add(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                player.Hkm.timeThroem = player.Hkm.timeThroem.sub(layers.Hkm.buyables['Hkm-fb-'+this.id[7]+'-4'].cost())
                setBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4',getBuyableAmount('Hkm','Hkm-fb-'+this.id[7]+'-4').add(1))
            },
            unlocked() {
                return player.Hkm.storyUnlocked >= 11
            }
        },
    },
    effect(){
        if(!hasMilestone('Hkm','Hkm-1')) return n(1)
        let eff = n(2).mul(player.Hkm.points.root(hasUpgrade('Hkm','Hkm-2')? 1 : 2))
        if(hasMilestone('Hkm','Hkm-1')) eff = eff.mul(tmp.Ain.effect)
        if(player.Hkm.storyUnlocked >= 2) eff = eff.mul(tmp.Hkm.timeThroemEff)
        if(hasGrid('Hkm',102)) eff = eff.mul(getEffect('',102))
        if(hasGrid('Hkm',202)) eff = eff.mul(getEffect('',202))
        if(hasGrid('Hkm',302)) eff = eff.mul(getEffect('',302))
        if(hasGrid('Hkm',402)) eff = eff.mul(getEffect('',402))
        return eff
    },
    tabFormat:{
        '时间机器':{
            content:[
                'main-display',
                'prestige-button',
                'blank',
                'milestones',
            ]
        },
        '银月湖':{
            content:[
                'main-display',
                ["row",[["upgrade","Hkm-1"],["upgrade","Hkm-2"],["upgrade","Hkm-3"],["upgrade","Hkm-4"],["upgrade","Hkm-5"]]],
                ["row",[["upgrade","Hkm-6"],["upgrade","Hkm-7"],["upgrade","Hkm-8"],["upgrade","Hkm-9"],["upgrade","Hkm-10"]]],
                ["row",[["upgrade","Hkm-11"],["upgrade","Hkm-12"],["upgrade","Hkm-13"],["upgrade","Hkm-14"],["upgrade","Hkm-15"]]],
            ],
            unlocked(){return player.Hkm.storyUnlocked >= 2},
        },
        "时空网格":{
            content:[
                ["row",[["buyable","Hkm-t1"],["buyable","Hkm-t2"],["buyable","Hkm-t3"]]],
                'blank',
                ['display-text',function(){return '<h4>总冷凝器数量: '+quickBigColor(formatWhole(tmp.Hkm.totalCompressor),'grey') +' , 它们在产生 '+quickBigColor('+'+format(tmp.Hkm.compressorEff),'grey')+' 时间能量每秒.'}],
                ['bar','Hkm-t1'],
                ['display-text',function(){return '<h4>未使用的时间之理: '+quickBigColor(formatWhole(player.Hkm.timeThroem),'grey') +' , 这提供了一个 '+quickBigColor('×'+format(tmp.Hkm.timeThroemEff),'grey')+' Hokma 效果加成'}],
                ['display-text',function(){return '<h4>时空网格力量: '+quickBigColor(format(tmp.Hkm.gridStrength.mul(100))+"%",'grey') +' , 影响全部网格节点效果并随时间流逝缓慢增加。'}],
                'blank',
                ['clickable','Hkm-tr1'],
                'blank',
                'grid',
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 2},
            buttonStyle(){return {'background':'grey','color':'black','box-shadow':'2px 2px 2px grey'}}
        },
        "时空泡沫":{
            content:[
                ['display-text',function(){return '<h4>你拥有 '+quickBigColor(formatWhole(player.Hkm.foems),'#555') +' 时空泡沫. 这提供了 '+quickBigColor('×'+format(tmp.Hkm.foemEff1),'#555')+' 的精华和 Kether点数 获取, 并且生成 '+quickBigColor('+'+formatWhole(tmp.Hkm.foemEff2)+"/sec",'#f00')+' 时间方盒·逆流 每秒。(可以被时间冷凝器转化为 时间方盒·顺流 )'}],
                ['display-text',function(){return '<h4>你的时间冷凝器正在转化 '+quickBigColor('+'+formatWhole(tmp.Hkm.boxGain)+'/sec','turquoise') +' 时间方盒·顺流 从 时间方盒·逆流 每秒.'}],
                "blank",
                ['clickable','Hkm-f1'],
                "blank",
                ['display-text',function(){return '<h4>你拥有 '+quickBigColor(formatWhole(player.Hkm.PeBox),'turquoise') +' 时间方盒·顺流. 提升到指数 '+quickBigColor(format(tmp.Hkm.PeBoxExp),'turquoise')+', 转化为 '+quickBigColor('×'+format(tmp.Hkm.PeBoxEff),'turquoise')+' 对 Hokma点数 的加成'}],
                ['display-text',function(){return '<h4>你拥有 '+quickBigColor(formatWhole(player.Hkm.NeBox),'red') +' 时间方盒·逆流, 削弱 时间方盒·顺流 的效果到 '+quickBigColor(format(tmp.Hkm.NeBoxEff.mul(100))+'%','red')}],
                ['display-text',function(){if(hasUpgrade('Ktr','Ktr-21')) return '<h4>你拥有 '+quickBigColor(formatWhole(tmp.Hkm.Sebox),'yellow') +' 四阶时间方盒, 提升时空泡沫的第一效果并降低 时间方盒·逆流 的削弱作用.'}],
                ['bar','Hkm-f1'],
                ["row",[["buyable","Hkm-f1"],["buyable","Hkm-f2"],["buyable","Hkm-f3"]]],
                ["row",[["buyable","Hkm-f4"],["buyable","Hkm-f5"],["buyable","Hkm-f6"]]],
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 6},
            buttonStyle(){return {'background':'#666666','color':'black','box-shadow':'2px 2px 2px #666666'}}
        },
        "永恒电池":{
            content:[
            ['display-text',function(){return '<h4>你拥有 '+quickBigColor(formatWhole(getBuyableAmount('Hkm','Hkm-b1').add(getBuyableAmount('Hkm','Hkm-b2')).add(getBuyableAmount('Hkm','Hkm-b3'))),GlowingColor('#ffaa00',10,'#ffdd00')) +' 永恒电池. 除以所有时空构造器的花费 '+quickBigColor('/'+format(tmp.Hkm.BatteryEff1),GlowingColor('#ff8800',10,'#ffaa00'))+', 并且给予 '+quickBigColor('×'+formatWhole(tmp.Hkm.BatteryEff2),GlowingColor('#ff6600',10,'#ff8800'))+' 的精华与 Kether点数 获取.'}],
            ["row",[["buyable","Hkm-b1"],["buyable","Hkm-b2"],["buyable","Hkm-b3"]]],
            ["row",[["clickable","Hkm-b1"],["clickable","Hkm-b2"],["clickable","Hkm-b3"]]],
            'blank',
            ["row",[["clickable","Hkm-fb-1-1"],["clickable","Hkm-fb-1-2"],["clickable","Hkm-fb-1-3"],["buyable","Hkm-fb-1-4"]]],
        ],
            unlocked(){return player.Hkm.storyUnlocked >= 10},
            buttonStyle(){return {'background':GlowingColor('#ffaa00',10,'#ffdd00'),'color':'black','box-shadow':'2px 2px 2px orange','border-color':'orange'}}
        },
    }
})

function ketherStory(){
    player.Ktr.newStory = false
    Modal.show({
		color: 'white',
		title() {if(player.Ktr.storyShowing < 100) return `<text style='color:#FFFFFF'>Kether's Quotes > Story `+player.Ktr.storyShowing+`</text>`
        else if(player.Ktr.storyShowing == 100) return `<text style='color:#FFFFFF'>Kether's Quotes > Mega Softcaps</text>`},
		text() {return tmp.Ktr.storyContent[player.Ktr.storyShowing].text},
		buttons:{
			1:{
				text:`Story 01`,
                onClick(){
                    player.Ktr.storyShowing = 1
                },
                unlocked(){return true}
			},
            2:{
				text:`02`,
                onClick(){
                    player.Ktr.storyShowing = 2
                },
                unlocked(){return player.Ktr.storyUnlocked >= 1}
			},
            3:{
				text:`03`,
                onClick(){
                    player.Ktr.storyShowing = 3
                },
                unlocked(){return player.Ktr.storyUnlocked >= 2}
			},
            4:{
				text:`04`,
                onClick(){
                    player.Ktr.storyShowing = 4
                },
                unlocked(){return player.Ktr.storyUnlocked >= 3}
			},
            5:{
				text:`05`,
                onClick(){
                    player.Ktr.storyShowing = 5
                },
                unlocked(){return player.Ktr.storyUnlocked >= 5}
			},
            6:{
				text:`06`,
                onClick(){
                    player.Ktr.storyShowing = 6
                },
                unlocked(){return player.Ktr.storyUnlocked >= 6}
			},
            7:{
				text:`07`,
                onClick(){
                    player.Ktr.storyShowing = 7
                },
                unlocked(){return player.Ktr.storyUnlocked >= 7}
			},
		}
	})
}

function hokmaStory(){
    player.Hkm.newStory = false
    Modal.show({
		color: 'gray',
		title() {return `<text style='color:gray'>Hokma's Quotes > Story `+player.Hkm.storyShowing+`</text>`},
		text() {return tmp.Hkm.storyContent[player.Hkm.storyShowing].text},
		buttons:{
			1:{
				text:`Story 01`,
                onClick(){
                    player.Hkm.storyShowing = 1
                },
                unlocked(){return true}
			},
            2:{
				text:`02`,
                onClick(){
                    player.Hkm.storyShowing = 2
                },
                unlocked(){return player.Hkm.storyUnlocked >= 1}
			},
            3:{
				text:`03`,
                onClick(){
                    player.Hkm.storyShowing = 3
                },
                unlocked(){return player.Hkm.storyUnlocked >= 2}
			},
            4:{
				text:`04`,
                onClick(){
                    player.Hkm.storyShowing = 4
                },
                unlocked(){return player.Hkm.storyUnlocked >= 3}
			},
            5:{
				text:`05`,
                onClick(){
                    player.Hkm.storyShowing = 5
                },
                unlocked(){return player.Hkm.storyUnlocked >= 4}
			},
            6:{
				text:`06`,
                onClick(){
                    player.Hkm.storyShowing = 6
                },
                unlocked(){return player.Hkm.storyUnlocked >= 5}
			},
            7:{
				text:`07`,
                onClick(){
                    player.Hkm.storyShowing = 7
                },
                unlocked(){return player.Hkm.storyUnlocked >= 6}
			},
            8:{
				text:`08`,
                onClick(){
                    player.Hkm.storyShowing = 8
                },
                unlocked(){return player.Hkm.storyUnlocked >= 7}
			},
            9:{
				text:`09`,
                onClick(){
                    player.Hkm.storyShowing = 9
                },
                unlocked(){return player.Hkm.storyUnlocked >= 8}
			},
            10:{
				text:`10`,
                onClick(){
                    player.Hkm.storyShowing = 10
                },
                unlocked(){return player.Hkm.storyUnlocked >= 9}
			},
            11:{
				text:`11`,
                onClick(){
                    player.Hkm.storyShowing = 11
                },
                unlocked(){return player.Hkm.storyUnlocked >= 10}
			},
            12:{
				text:`12`,
                onClick(){
                    player.Hkm.storyShowing = 12
                },
                unlocked(){return player.Hkm.storyUnlocked >= 11}
			},
		}
	})
}
addLayer("Ain", {
    name: "Ain", // This is optional, only used in a few places, If absent it just uses the layer id.
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        feature: 0,
        hkm4unlocked: false,
        hkm5unlocked: false,
        hkm6unlocked: false,
        bestReset: 999999,
    }},
    color: "pink",
    resource: "Ain 点数",
    symbol(){return "Ain<sup>"+player.Ain.achievements.length},
    effect() {
        return Decimal.pow(n(2),player.Ain.points)
    },
    effectDescription() {
        return "提升 Hokma 的效果 "+quickBigColor(format(tmp.Ain.effect.mul(100))+"%","pink")
    },
    nodeStyle(){
        return {
            "border-color":"pink",
            "border-width":"3px",
            "background": "linear-gradient(135deg,pink 6%, white 99%)",
            "height": "70px",
            "width": "70px",
			"border-radius": "5px"
        }
    },
    achievements: {
        'Hkm-1':{
            name() {return "分贝娃娃"},
            tooltip() { return '获得第二个 Hokma 点数.(+1 Ain点数)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Hkm.points.gte(2)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-2':{
            name() {return "辞岁"},
            tooltip() { return '在心之门中停留一整天 (现实时间) +1 Ain点数, 最佳 Hokma 重置时间提升 Hokma 点数倍率。<br>当前： ×'+format(n(15).div(player.Ain.bestReset+0.2).add(1).min(30))},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ktr.realTime.gte(86400)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-3':{
            name() {return "毛佩毛佩"},
            tooltip() { return 'Have 48 方舟. (+1 Ain点数, 46 后的每个方舟提升 Hokma 点数 获取 2×.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ktr.ark.gte(48)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-4':{
            name() {return "初始化"},
            tooltip() { return '不重置 Kether 的回忆并进行 Hokma 重置。 (+1 Ain点数, 奖励： Kether 的回忆不再有负面效果.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm4unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-5':{
            name() {return "猛冲"},
            tooltip() { return '在极远星空至少有一种星体为 lv0 的情况下，进行一次 Hokma 重置. (+1 Ain点数, 奖励： 获得 100% 极远星空中资源每秒，但仅当它们在正常情况下可获取 >1% 每秒的情况下才有效。)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm5unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-6':{
            name() {return "创世神"},
            tooltip() { return '不洗点遥远星空升级就完成一次 Hokma 重置. (+1 Ain点数, 奖励：遥远星空升级无花费。)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.hkm6unlocked}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-7':{
            name() {return "方舟觉醒"},
            tooltip() { return '400ms 内完成方舟重置. (+1 Ain点数, 奖励： 每秒获得 1000% 重置时可获取的 Hokma 点数.)'},
            done() { return hasMilestone('Hkm','Hkm-1') && player.Ain.bestReset <= 0.4}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-8':{
            name() {return "冰河作用"},
            tooltip() { return '拥有5个时间之理. (+1 Ain点数, 奖励： Ain 点数效果也对时间能量获取生效。)'},
            done() { return player.Hkm.totalTimeThroem.gte(5)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-9':{
            name() {return "新生活"},
            tooltip() { return '在时空网格中获取一个节点。 (+1 Ain点数)'},
            done() { return hasGrid('Hkm',101)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(1)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-10':{
            name() {return "苏丹之怒"},
            tooltip() { return '在时空网格的一行中同时拥有两个节点. (+2 Ain点数)'},
            done() { return hasGrid('Hkm',101) && hasGrid('Hkm',102)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-11':{
            name() {return "云女孩"},
            tooltip() { return '在时空网格的一行中同时拥有三个节点. (+2 Ain点数)'},
            done() { return hasGrid('Hkm',101) && hasGrid('Hkm',102) && hasGrid('Hkm',103)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-12':{
            name() {return "下一次"},
            tooltip() { return '获得超过 120% 的网格力量. (+2 Ain点数)'},
            done() { return tmp.Hkm.gridStrength.gte(1.2)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-13':{
            name() {return "人"},
            tooltip() { return '解锁时空泡沫. (+2 Ain点数)'},
            done() { return player.Hkm.storyUnlocked >= 6}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-14':{
            name() {return "时钟悖论"},
            tooltip() { return '获得超过 1e1,000 恒星点数. (+2 Ain点数)'},
            done() { return player.Ktr.stallar.gte('1e1000')}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-15':{
            name() {return "将一切抛诸脑后"},
            tooltip() { return '获得超过 1e1,000^(99%) Kether点数. (+2 Ain点数, Hkm-t2公式更好.)'},
            done() { return player.Ktr.points.gte('1e990')}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-16':{
            name() {return "灾害根除"},
            tooltip() { return '在时空网格中占有五个节点。 (+2 Ain点数, 解锁一些新的 Kether 升级。)'},
            done() { return tmp.Hkm.totalGrid >= 5}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(2)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-17':{
            name() {return "彩色日子"},
            tooltip() { return '在时空网格中购买 Te4。 (+3 Ain点数, Te2 的花费降低到 50%.)'},
            done() { return hasGrid('Hkm',404)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-18':{
            name() {return "光"},
            tooltip() { return '拥有一个永恒电池. (+3 Ain点数)'},
            done() { return tmp.Hkm.BatteryEff2.gte(1e50)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
        'Hkm-19':{
            name() {return "下雨的内心"},
            tooltip() { return '拥有一个煤炭电池. (+3 Ain点数)'},
            done() { return getBuyableAmount('Hkm','Hkm-fb-1-4').gte(1)}, 
            onComplete() {return player.Ain.points = player.Ain.points.add(3)
            },
			style() { if(hasAchievement(this.layer,this.id)) return {'background-color':'grey','box-shadow':'grey 0px 2px 2px'} },
        },
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone('Hkm','Hkm-1')},
    tabFormat:{
        "成就":{
                content:[
                    "main-display",
                    "blank",
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段 2-1] 初到星羽镇 <br>完成这一行的全部成就来解锁时间冷凝器 (在 Hokma 层中).'}],
                    ['row',[["achievement",'Hkm-1'],["achievement",'Hkm-2'],["achievement",'Hkm-3'],["achievement",'Hkm-4'],["achievement",'Hkm-5'],["achievement",'Hkm-6'],["achievement",'Hkm-7']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段 2-2] 污秽之世 美丽之笼 <br>完成这一行的全部成就来解锁泡沫构筑器!'}],
                    ['row',[["achievement",'Hkm-8'],["achievement",'Hkm-9'],["achievement",'Hkm-10'],["achievement",'Hkm-11'],["achievement",'Hkm-12'],["achievement",'Hkm-13'],["achievement",'Hkm-14']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                    ["column", [["raw-html", function() {}],
                     "blank",['display-text',function(){return '<h3>[阶段 2-3] 虚无之伤痕<br>'}],
                    ['row',[["achievement",'Hkm-15'],["achievement",'Hkm-16'],["achievement",'Hkm-17'],["achievement",'Hkm-18'],["achievement",'Hkm-19'],["achievement",'Hkm-20'],["achievement",'Hkm-21']]],
                    "blank",
                    ],
                    {
                        "color":"black",
                        "width":"700px",
                        "border-color":"#FFFFFF",
                        "border-width":"3px",
                        "background-color":"#AAAAAA",
                    }],
                ],
                buttonStyle() {return {"color":"#FFFFFF",
                "border-radius":"5px",
                "border-color":"#FFFFFF",
                "border-width":"2px",
                "background":"#000000",
                "background-image":
                "linear-gradient(#000 15px,transparent 0),linear-gradient(90deg,white 1px,transparent 0)",
                "background-size":"16px 16px,16px 16px",
                "box-shadow":"2px 2px 2px white"
                }}
            },
        },
})

function onReset(layer){
    if(layer == 'Hkm' && player.Hkm.resetTime < player.Ain.bestReset) player.Ain.bestReset = player.Hkm.resetTime
    if(layer == 'Hkm' && player.Ktr.resetedMemory == false) player.Ain.hkm4unlocked = true
    if(layer == 'Hkm' && player.Ktr.respeced == false) player.Ain.hkm6unlocked = true
    if(layer == 'Hkm' && (tmp.Ktr.celestialLevel[0].lt(1)||tmp.Ktr.celestialLevel[1].lt(1)||tmp.Ktr.celestialLevel[2].lt(1)||tmp.Ktr.celestialLevel[3].lt(1)||tmp.Ktr.celestialLevel[4].lt(1))) player.Ain.hkm5unlocked = true
}

function getEffect(data, id){
    let effect = n(0)
    if(id == 101) effect = tmp.Ktr.celestialLevel[4].add(1).pow(4)
    if(id == 201) effect = tmp.Ktr.celestialLevel[1].add(1).pow(5)
    if(id == 301) effect = n(1e12)
    if(id == 401) effect = Decimal.pow(25,player.Ktr.upgrades.length)
    if(id == 102) effect = tmp.Ktr.celestialLevel[3].add(1).pow(4)
    if(id == 202) effect = tmp.Ktr.celestialLevel[0].add(1).pow(5)
    if(id == 302) effect = n(1e14)
    if(id == 402) effect = Decimal.pow(60,player.Ktr.upgrades.length)
    if(id == 103) effect = n(0.03)
    if(id == 203) effect = n(0.05)
    if(id == 303) effect = n(0.075)
    if(id == 403) effect = n(0.09)
    if(id == 104) effect = n(1e4).pow(hasGrid('Hkm',404)? getEffect('',404):1)
    if(id == 204) effect = Decimal.pow(7,tmp.Hkm.totalGrid).min(1e9)
    if(id == 304) effect = player.points.add(1).log10().pow(3)
    if(id == 404) effect = n(3)
    if(id % 100 != 3) effect = effect.pow(tmp.Hkm.gridStrength)
    return effect
}

function hasGrid(layer,id){
    return player[layer].grid[id] >= 1
}

function getProfix(data, id){
    let profix = '×'
    if(id % 100 == 3) profix = '+'
    if(id == 104) profix = '/'
    if(id == 404) profix = '^'
    return profix
}

function batteryReset(){
    for(var i = 1; i <= 6; i++){
        setBuyableAmount('Hkm','Hkm-f'+i,n(0))
    }
    player.Hkm.foems = n(0)
    player.Hkm.PeBox = n(0)
    player.Hkm.NeBox = n(0)
    player.Hkm.timeEnergy = n(0)
}