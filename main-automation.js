/** @param {NS} ns **/
export async function main(ns) {
    // Konfiguration
    const ram = 1024; // Anpassen der Server-RAM-Größe nach Bedarf
    const targetFile = "best-target.txt";

    // Skript-Namen
    const scriptNames = [
        "network-scan.js",
        "hack-template.js",
        "deploy-hack.js",
        "purchase-servers.js",
        "upgrade-servers.js",
        "automate-purchase.js",
        "company-work.js",
        "faction-work.js",
        "bladeburner.js",
        "university-study.js",
        "travel.js",
        "casino.js",
        "create-exe.js",
        "hacknet-management.js",
        "singularity-management.js",
        "gym-management.js",
        "ipvgo-subnet-management.js",
        "watchdog.js",
        "crime.js",
        "stock-trading.js",
        "script-optimization.js",
        "task-monitor.js",
        "log-output.js",
        "stat-monitor.js",
        "find-best-target.js"
    ];

    // Skript-Inhalte
    const scriptContents = {
        "network-scan.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "network-scan", message); };
    let servers = ["home"];
    let scanned = [];
    let data = [];

    while (servers.length > 0) {
        let server = servers.pop();
        if (!scanned.includes(server)) {
            scanned.push(server);
            servers = servers.concat(ns.scan(server));
            data.push(server);
        }
    }
    await ns.write("network-scan-output.txt", data.join(","), "w");
    await log("Completed network scan.");
}`,
        "hack-template.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "hack-template", message); };
    const target = ns.args[0];

    if (!target) {
        await log("No target specified. Exiting script.");
        return;
    }

    if (!ns.serverExists(target)) {
        await log("Invalid target server: " + target);
        return;
    }

    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
            await log("Weakened " + target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
            await log("Grew " + target);
        } else {
            await ns.hack(target);
            await log("Hacked " + target);
        }
    }
}`,
        "deploy-hack.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "deploy-hack", message); };
    const script = ns.args[0];
    const target = ns.args[1];
    const servers = await ns.read("network-scan-output.txt").split(",");

    for (let server of servers) {
        if (ns.hasRootAccess(server)) {
            const ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            const threads = Math.floor(ram / ns.getScriptRam(script));
            if (threads > 0) {
                if (!(await ns.scp(script, server))) {
                    await log("Failed to SCP " + script + " to " + server);
                }
                ns.exec(script, server, threads, target);
                await log("Deployed " + script + " to " + server + " with " + threads + " threads");
            }
        }
    }
}`,
        "purchase-servers.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "purchase-servers", message); };
    const ram = ns.args[0];
    const maxServers = ns.getPurchasedServerLimit();
    const prefix = "pserv-";

    for (let i = 0; i < maxServers; i++) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            let hostname = ns.purchaseServer(prefix + i, ram);
            await log("Purchased server: " + hostname);
        }
    }
}`,
        "upgrade-servers.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "upgrade-servers", message); };
    const ram = ns.args[0];
    const prefix = "pserv-";

    for (let server of ns.getPurchasedServers()) {
        if (ns.getServerMaxRam(server) < ram && ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            ns.killall(server);
            ns.deleteServer(server);
            let hostname = ns.purchaseServer(prefix + server.split('-')[1], ram);
            await log("Upgraded server: " + hostname);
        }
    }
}`,
        "automate-purchase.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "automate-purchase", message); };
    const script = "hack-template.js";
    const ram = ns.args[0];

    while (true) {
        await ns.run("purchase-servers.js", 1, ram);
        await ns.sleep(10000);
        const target = await ns.run("find-best-target.js");
        await ns.sleep(2000);
        const bestTarget = await ns.read("best-target.txt");
        await ns.run("deploy-hack.js", 1, script, bestTarget);
        await log("Automated purchase and deploy on target: " + bestTarget);
        await ns.sleep(60000);
    }
}`,
        "company-work.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "company-work", message); };
    const company = ns.args[0];

    if (!ns.singularity) {
        await log("Singularity API is not available. Ensure the API is unlocked.");
        return;
    }

    while (true) {
        ns.singularity.applyToCompany(company, "Software");
        ns.singularity.workForCompany(company, true);
        await log("Working for company: " + company);
        await ns.sleep(3600000); // Work for 1 hour
    }
}`,
        "faction-work.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "faction-work", message); };
    const faction = ns.args[0];
    const workType = ns.args[1] || "hacking contracts";

    if (!ns.singularity) {
        await log("Singularity API is not available. Ensure the API is unlocked.");
        return;
    }

    while (true) {
        ns.singularity.workForFaction(faction, workType, true);
        await log("Working for faction: " + faction + " on " + workType);
        await ns.sleep(3600000); // Work for 1 hour
    }
}`,
        "bladeburner.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "bladeburner", message); };
    const cities = ["Sector-12", "Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven"];
    let currentCity = 0;

    while (true) {
        if (ns.bladeburner.getStamina()[0] / ns.bladeburner.getStamina()[1] < 0.5) {
            ns.bladeburner.goToCity(cities[currentCity]);
            ns.bladeburner.startAction("General", "Training");
            await log("Training in " + cities[currentCity]);
            currentCity = (currentCity + 1) % cities.length;
        } else {
            ns.bladeburner.startAction("Operation", "Assassination");
            await log("Performing assassination in " + ns.bladeburner.getCity());
        }
        await ns.sleep(60000);
    }
}`,
        "university-study.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "university-study", message); };
    const course = "Algorithms"; // Default course
    const university = "Rothman University"; // Default university

    while (true) {
        ns.singularity.universityCourse(university, course, true);
        await log("Studying " + course + " at " + university);
        await ns.sleep(3600000); // Study for 1 hour
    }
}`,
        "travel.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "travel", message); };
    const cities = ["Sector-12", "Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven"];
    let currentCity = 0;

    while (true) {
        ns.travelToCity(cities[currentCity]);
        await log("Travelled to: " + cities[currentCity]);
        ns.run("ipvgo-subnet-management.js"); // Start subnet management in each city
        currentCity = (currentCity + 1) % cities.length;
        await ns.sleep(3600000); // Travel every hour
    }
}`,
        "casino.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "casino", message); };
    while (true) {
        try {
            if (ns.gambling(true)) {
                await log("Won at the casino!");
            } else {
                await log("Lost at the casino.");
            }
        } catch (e) {
            await log("Casino function not available: " + e);
        }
        await ns.sleep(60000); // Gamble every minute
    }
}`,
        "create-exe.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "create-exe", message); };
    const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "DeepscanV1.exe", "DeepscanV2.exe", "ServerProfiler.exe"];
    for (let program of programs) {
        while (true) {
            if (!ns.fileExists(program, "home")) {
                ns.createProgram(program);
                await log("Creating program: " + program);
                break;
            }
            await ns.sleep(3600000); // Check every hour
        }
    }
}`,
        "hacknet-management.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "hacknet-management", message); };
    const budgetFraction = 0.1; // Fraction of money to be used for Hacknet upgrades
    let lastBalance = ns.getServerMoneyAvailable("home");

    while (true) {
        const currentBalance = ns.getServerMoneyAvailable("home");
        let budget = currentBalance * budgetFraction;

        // Adjust budget dynamically based on balance changes
        if (currentBalance > lastBalance * 1.2) {
            budget *= 1.2;
        } else if (currentBalance < lastBalance * 0.8) {
            budget *= 0.8;
        }
        lastBalance = currentBalance;

        let purchased = false;

        // Try to purchase new nodes if possible
        while (ns.hacknet.numNodes() < ns.hacknet.getMaxNumNodes() && ns.hacknet.getPurchaseNodeCost() < budget) {
            ns.hacknet.purchaseNode();
            budget = ns.getServerMoneyAvailable("home") * budgetFraction;
            purchased = true;
            await log("Purchased Hacknet node");
        }

        // Upgrade existing nodes
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            let nodeBudget = ns.getServerMoneyAvailable("home") * budgetFraction;
            while (ns.hacknet.getLevelUpgradeCost(i, 1) < nodeBudget) {
                ns.hacknet.upgradeLevel(i, 1);
                nodeBudget = ns.getServerMoneyAvailable("home") * budgetFraction;
                await log("Upgraded Hacknet node " + i + " level");
            }
            while (ns.hacknet.getRamUpgradeCost(i, 1) < nodeBudget) {
                ns.hacknet.upgradeRam(i, 1);
                nodeBudget = ns.getServerMoneyAvailable("home") * budgetFraction;
                await log("Upgraded Hacknet node " + i + " RAM");
            }
            while (ns.hacknet.getCoreUpgradeCost(i, 1) < nodeBudget) {
                ns.hacknet.upgradeCore(i, 1);
                nodeBudget = ns.getServerMoneyAvailable("home") * budgetFraction;
                await log("Upgraded Hacknet node " + i + " cores");
            }
            while (ns.hacknet.getCacheUpgradeCost(i, 1) < nodeBudget) {
                ns.hacknet.upgradeCache(i, 1);
                nodeBudget = ns.getServerMoneyAvailable("home") * budgetFraction;
                await log("Upgraded Hacknet node " + i + " cache");
            }
        }

        if (!purchased) {
            await ns.sleep(60000); // Check every minute if no purchase was made
        }
    }
}`,
        "singularity-management.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "singularity-management", message); };
    if (!ns.singularity) {
        await log("Singularity API is not available. Ensure the API is unlocked.");
        return;
    }

    while (true) {
        // Auto-join factions if criteria are met
        const factions = ns.singularity.checkFactionInvitations();
        for (const faction of factions) {
            ns.singularity.joinFaction(faction);
            await log("Joined faction: " + faction);
        }

        const programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "DeepscanV1.exe", "DeepscanV2.exe", "ServerProfiler.exe", "AutoLink.exe"];
        for (const program of programs) {
            if (!ns.fileExists(program, "home") && ns.singularity.purchaseProgram(program)) {
                await log("Purchased program: " + program);
            }
        }

        if (ns.getPlayer().hasTixApiAccess && ns.getPlayer().has4SDataTixApi) {
            const stockSymbols = ns.stock.getSymbols();
            for (const symbol of stockSymbols) {
                if (ns.getServerMoneyAvailable("home") > 1e9) {
                    const price = ns.stock.getAskPrice(symbol);
                    const shares = Math.floor((ns.getServerMoneyAvailable("home") / price) / 100) * 100;
                    if (shares > 0) {
                        ns.stock.buy(symbol, shares);
                        await log("Bought shares of " + symbol + ": " + shares);
                    }
                }
            }
        }

        const megaCorpRep = ns.singularity.getCompanyRep("MegaCorp");
        const cyberSecRep = ns.singularity.getFactionRep("CyberSec");
        if (megaCorpRep < 200000 && ns.singularity.getCompanyFavorGain("MegaCorp") < 150) {
            ns.singularity.workForCompany("MegaCorp", true);
            await log("Working for MegaCorp");
        } else if (cyberSecRep < 50000) {
            ns.singularity.workForFaction("CyberSec", "hacking contracts", true);
            await log("Working for CyberSec");
        }

        const ownedAugs = ns.singularity.getOwnedAugmentations(true);
        for (const faction of ns.getPlayer().factions) {
            const augs = ns.singularity.getAugmentationsFromFaction(faction);
            for (const aug of augs) {
                if (!ownedAugs.includes(aug) && ns.getServerMoneyAvailable("home") > ns.singularity.getAugmentationCost(aug)[0]) {
                    ns.singularity.purchaseAugmentation(faction, aug);
                    await log("Purchased augmentation: " + aug + " from " + faction);
                }
            }
        }

        if (ns.singularity.getOwnedAugmentations(false).length > 20) {
            ns.singularity.installAugmentations();
            await log("Installing augmentations and restarting.");
            ns.singularity.softReset("master-automation.js");
            return;
        }

        await ns.sleep(60000); // Check every minute
    }
}`,
        "gym-management.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "gym-management", message); };
    const gym = "Powerhouse Gym";
    const skills = ["Strength", "Defense", "Dexterity", "Agility"];
    const skillGoals = {
        "Strength": 500,
        "Defense": 500,
        "Dexterity": 500,
        "Agility": 500
    };
    let currentSkillIndex = 0;

    while (true) {
        const currentSkill = skills[currentSkillIndex];
        if (ns.getPlayer()[currentSkill.toLowerCase()] < skillGoals[currentSkill]) {
            ns.singularity.gymWorkout(gym, currentSkill, true);
            await log("Training " + currentSkill + " at " + gym);
        } else {
            currentSkillIndex = (currentSkillIndex + 1) % skills.length; // Move to the next skill
        }
        await ns.sleep(60000); // Train for 1 minute before checking again
    }
}`,
        "ipvgo-subnet-management.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "ipvgo-subnet-management", message); };
    while (true) {
        const subnets = ns.scan("home"); // Replace "home" with the specific node if needed
        for (const subnet of subnets) {
            if (ns.hasRootAccess(subnet)) {
                await log("Managing subnet: " + subnet);
                // Perform subnet-specific tasks here
                // Example: Deploy hacking scripts or perform subnet-specific actions
                // You can extend this to perform more complex subnet management
            } else {
                await log("No root access to subnet: " + subnet);
            }
        }
        await ns.sleep(300000); // Check every 5 minutes
    }
}`,
        "watchdog.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "watchdog", message); };
    const scriptPids = {};

    // Function to start a script if not running
    async function startScript(script, ...args) {
        if (scriptPids[script] === undefined || !ns.isRunning(script, "home", ...args)) {
            if (scriptPids[script]) ns.kill(scriptPids[script]);
            scriptPids[script] = ns.run(script, 1, ...args);
            await log("Started " + script + " with PID " + scriptPids[script]);
        }
    }

    // Monitor and restart scripts
    while (true) {
        await startScript("network-scan.js");
        await startScript("automate-purchase.js", ram);
        await startScript("hacknet-management.js");
        await startScript("singularity-management.js");
        await startScript("company-work.js", "MegaCorp");
        await startScript("faction-work.js", "CyberSec", "hacking contracts");
        await startScript("bladeburner.js");
        await startScript("university-study.js");
        await startScript("travel.js");
        await startScript("casino.js");
        await startScript("create-exe.js");
        await startScript("gym-management.js");
        await startScript("ipvgo-subnet-management.js");
        await startScript("crime.js");
        await startScript("stock-trading.js");
        await startScript("script-optimization.js");
        await startScript("task-monitor.js");
        await startScript("stat-monitor.js");

        await ns.sleep(60000); // Check every minute
    }
}`,
        "crime.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "crime", message); };
    const crimes = ["shoplift", "rob store", "mug someone", "larceny", "deal drugs", "bond forgery", "trafficking arms", "homicide", "grand theft auto", "kidnap", "assassinate", "heist"];
    let currentCrime = 0;

    while (true) {
        const crime = crimes[currentCrime];
        if (ns.singularity.getCrimeChance(crime) > 0.5) {
            ns.singularity.commitCrime(crime);
            await log("Committing crime: " + crime);
            await ns.sleep(ns.singularity.getCrimeStats(crime).time + 1000); // Wait for the crime to complete
        }
        currentCrime = (currentCrime + 1) % crimes.length; // Move to the next crime
        await ns.sleep(1000); // Sleep briefly between crime checks
    }
}`,
        "stock-trading.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "stock-trading", message); };
    if (!ns.getPlayer().hasTixApiAccess || !ns.getPlayer().has4SDataTixApi) {
        await log("Stock market API not available. Skipping stock trading.");
        return;
    }

    while (true) {
        const stocks = ns.stock.getSymbols();
        const cash = ns.getServerMoneyAvailable("home");
        const positions = [];

        // Buy stocks
        for (const stock of stocks) {
            const askPrice = ns.stock.getAskPrice(stock);
            if (askPrice < cash * 0.05) {
                const shares = Math.floor((cash * 0.05) / askPrice);
                if (shares > 0) {
                    const purchaseCost = ns.stock.buy(stock, shares);
                    if (purchaseCost > 0) {
                        positions.push({ stock, shares });
                        await log("Bought " + shares + " shares of " + stock);
                    }
                }
            }
        }

        // Sell stocks if profitable
        for (const pos of positions) {
            const sellPrice = ns.stock.getBidPrice(pos.stock);
            const profit = sellPrice * pos.shares - ns.stock.getPurchaseCost(pos.stock, pos.shares);
            if (profit > ns.stock.getPurchaseCost(pos.stock, pos.shares) * 0.1) {
                ns.stock.sell(pos.stock, pos.shares);
                await log("Sold " + pos.shares + " shares of " + pos.stock + " for a profit of " + profit);
            }
        }

        await ns.sleep(60000); // Check every minute
    }
}`,
        "script-optimization.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "script-optimization", message); };
    while (true) {
        await log("Starting script optimization...");

        // Check and adjust RAM usage for all deployed scripts
        const scripts = ns.ps("home");
        for (const script of scripts) {
            const scriptRam = ns.getScriptRam(script.filename);
            if (scriptRam > ns.getServerMaxRam("home") * 0.1) {
                await log(\`Warning: Script \${script.filename} is using excessive RAM: \${scriptRam} GB\`);
                // Example optimization: adjust thread count or other parameters if script uses too much RAM
                ns.kill(script.filename, "home");
                const availableRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
                const maxThreads = Math.floor(availableRam / scriptRam);
                if (maxThreads > 0) {
                    ns.run(script.filename, maxThreads, ...script.args);
                    await log(\`Restarted \${script.filename} with \${maxThreads} threads\`);
                } else {
                    await log(\`Insufficient RAM to restart \${script.filename}\`);
                }
            }
        }

        // Optimize specific scripts based on performance
        if (ns.isRunning("hack-template.js", "home")) {
            const target = await ns.read("best-target.txt").trim();
            const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
            const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
            if (ns.getServerSecurityLevel(target) > securityThresh) {
                await log("Target server security is too high. Adjusting...");
                ns.run("weaken.js", 1, target); // Adjust script as needed
            } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
                await log("Target server money is too low. Adjusting...");
                ns.run("grow.js", 1, target); // Adjust script as needed
            } else {
                ns.run("hack.js", 1, target); // Adjust script as needed
            }
        }

        // Optimize hacknet usage
        const hacknetNodes = ns.hacknet.numNodes();
        for (let i = 0; i < hacknetNodes; i++) {
            const levelCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            const cacheCost = ns.hacknet.getCacheUpgradeCost(i, 1);
            const currentBalance = ns.getServerMoneyAvailable("home");

            if (levelCost < currentBalance * 0.01) {
                ns.hacknet.upgradeLevel(i, 1);
                await log(\`Upgraded Hacknet Node \${i} level\`);
            }
            if (ramCost < currentBalance * 0.01) {
                ns.hacknet.upgradeRam(i, 1);
                await log(\`Upgraded Hacknet Node \${i} RAM\`);
            }
            if (coreCost < currentBalance * 0.01) {
                ns.hacknet.upgradeCore(i, 1);
                await log(\`Upgraded Hacknet Node \${i} cores\`);
            }
            if (cacheCost < currentBalance * 0.01) {
                ns.hacknet.upgradeCache(i, 1);
                await log(\`Upgraded Hacknet Node \${i} cache\`);
            }
        }

        // Check singularity actions and adjust accordingly
        if (ns.singularity.getOwnedAugmentations(false).length > 20) {
            ns.singularity.installAugmentations();
            await log("Installing augmentations and restarting.");
            ns.singularity.softReset("master-automation.js");
        }

        // Adjust stock trading strategy
        if (ns.getPlayer().hasTixApiAccess && ns.getPlayer().has4SDataTixApi) {
            const stockSymbols = ns.stock.getSymbols();
            for (const symbol of stockSymbols) {
                const forecast = ns.stock.getForecast(symbol);
                if (forecast > 0.6 || forecast < 0.4) {
                    const shares = ns.stock.getPosition(symbol)[0];
                    if (shares > 0) {
                        ns.stock.sell(symbol, shares);
                        await log(\`Sold shares of \${symbol} based on forecast: \${forecast}\`);
                    }
                }
            }
        }

        await ns.sleep(600000); // Run optimization every 10 minutes
    }
}`,
        "task-monitor.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "task-monitor", message); };

    while (true) {
        await log("Monitoring tasks...");

        // Monitor and optimize work for company
        if (ns.singularity.isBusy()) {
            const currentTask = ns.singularity.getCurrentWork();
            if (currentTask.type === "COMPANY") {
                const companyRep = ns.singularity.getCompanyRep(currentTask.companyName);
                const favor = ns.singularity.getCompanyFavor(currentTask.companyName);
                if (companyRep > 100000 && favor > 100) {
                    ns.singularity.stopWork();
                    await log("Stopped working for company: " + currentTask.companyName);
                }
            }
        }

        // Monitor and optimize faction work
        if (ns.singularity.isBusy()) {
            const currentTask = ns.singularity.getCurrentWork();
            if (currentTask.type === "FACTION") {
                const factionRep = ns.singularity.getFactionRep(currentTask.factionName);
                if (factionRep > 100000) {
                    ns.singularity.stopWork();
                    await log("Stopped working for faction: " + currentTask.factionName);
                }
            }
        }

        // Monitor and optimize gym workout
        if (ns.singularity.isBusy()) {
            const currentTask = ns.singularity.getCurrentWork();
            if (currentTask.type === "CLASS") {
                const skills = ["strength", "defense", "dexterity", "agility"];
                const skillGoals = {
                    "strength": 500,
                    "defense": 500,
                    "dexterity": 500,
                    "agility": 500
                };
                for (const skill of skills) {
                    if (ns.getPlayer()[skill] > skillGoals[skill]) {
                        ns.singularity.stopWork();
                        await log("Stopped gym workout for: " + skill);
                        break;
                    }
                }
            }
        }

        // Monitor and optimize university study
        if (ns.singularity.isBusy()) {
            const currentTask = ns.singularity.getCurrentWork();
            if (currentTask.type === "STUDY") {
                if (ns.getPlayer().hacking > 500) {
                    ns.singularity.stopWork();
                    await log("Stopped university study.");
                }
            }
        }

        // Monitor crime progress
        if (ns.singularity.isBusy()) {
            const currentTask = ns.singularity.getCurrentWork();
            if (currentTask.type === "CRIME") {
                if (ns.singularity.getCrimeChance(currentTask.crimeType) > 0.9) {
                    ns.singularity.stopWork();
                    await log("Stopped committing crime: " + currentTask.crimeType);
                }
            }
        }

        // Enable focus if needed
        if (ns.singularity.isBusy() && !ns.singularity.isFocused()) {
            ns.singularity.setFocus(true);
            await log("Focus enabled for faster task completion.");
        }

        await ns.sleep(30000); // Check every 30 seconds
    }
}`,
        "log-output.js": `/** @param {NS} ns **/
export async function main(ns) {
    const scriptName = ns.args[0];
    const message = ns.args[1];
    ns.tprint(\`[\${scriptName}] \${message}\`);
}`,
        "stat-monitor.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "stat-monitor", message); };

    while (true) {
        const player = ns.getPlayer();
        const target = await ns.read("best-target.txt").trim();

        if (!target || !ns.serverExists(target)) {
            await log("Invalid or no target specified.");
            await ns.run("find-best-target.js");
            await ns.sleep(10000);
            continue;
        }

        // Evaluate and optimize hacking scripts
        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) + 5) {
            ns.run("weaken.js", 1, target);
            await log("Security high on " + target + ". Weakening.");
        } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * 0.75) {
            ns.run("grow.js", 1, target);
            await log("Money low on " + target + ". Growing.");
        } else {
            ns.run("hack.js", 1, target);
            await log("Hacking " + target);
        }

        // Monitor and optimize training
        if (player.strength < 500 || player.defense < 500 || player.dexterity < 500 || player.agility < 500) {
            const gym = "Powerhouse Gym";
            const skill = player.strength < 500 ? "Strength" : player.defense < 500 ? "Defense" : player.dexterity < 500 ? "Dexterity" : "Agility";
            ns.singularity.gymWorkout(gym, skill, true);
            await log("Training " + skill + " at " + gym);
        }

        // Monitor and optimize hacking experience
        if (player.hacking < 500 && !ns.singularity.isBusy()) {
            ns.singularity.universityCourse("Rothman University", "Algorithms", true);
            await log("Studying Algorithms at Rothman University");
        }

        // Adjust Bladeburner tasks
        if (ns.bladeburner.getStamina()[0] / ns.bladeburner.getStamina()[1] < 0.5) {
            ns.bladeburner.startAction("General", "Training");
            await log("Training Bladeburner skills.");
        } else {
            ns.bladeburner.startAction("Operation", "Assassination");
            await log("Performing Bladeburner assassination.");
        }

        // Check stock trading
        if (ns.getPlayer().hasTixApiAccess && ns.getPlayer().has4SDataTixApi) {
            const stocks = ns.stock.getSymbols();
            for (const stock of stocks) {
                const forecast = ns.stock.getForecast(stock);
                if (forecast > 0.6 || forecast < 0.4) {
                    const shares = ns.stock.getPosition(stock)[0];
                    if (shares > 0) {
                        ns.stock.sell(stock, shares);
                        await log("Sold shares of " + stock + " based on forecast: " + forecast);
                    }
                }
            }
        }

        // Ensure focus is enabled if needed
        if (ns.singularity.isBusy() && !ns.singularity.isFocused()) {
            ns.singularity.setFocus(true);
            await log("Focus enabled for task.");
        }

        await ns.sleep(1000); // Check every second
    }
}`,
        "find-best-target.js": `/** @param {NS} ns **/
export async function main(ns) {
    const log = async (message) => { ns.run("log-output.js", 1, "find-best-target", message); };
    const servers = await ns.read("network-scan-output.txt").split(",");
    let bestTarget = null;
    let bestProfit = 0;

    for (const server of servers) {
        if (!ns.hasRootAccess(server) || ns.getServerMaxMoney(server) === 0) continue;

        const maxMoney = ns.getServerMaxMoney(server);
        const minSecurity = ns.getServerMinSecurityLevel(server);
        const growth = ns.getServerGrowth(server);
        const hackTime = ns.getHackTime(server);
        const profit = (maxMoney / hackTime) * (growth / minSecurity); // Simplified profit calculation

        if (profit > bestProfit) {
            bestProfit = profit;
            bestTarget = server;
        }
    }

    if (bestTarget) {
        await ns.write("best-target.txt", bestTarget, "w");
        await log("Best target identified: " + bestTarget);
    } else {
        await log("No valid target found. Exiting script.");
        ns.exit();
    }
}`
    };

    // Funktion zum Löschen alter Skripte
    async function deleteOldScripts() {
        for (const script of scriptNames) {
            if (ns.fileExists(script, "home")) {
                ns.rm(script, "home");
                ns.tprint("Deleted old script: " + script);
            }
        }
    }

    // Alte Skripte löschen
    await deleteOldScripts();

    // Alle Skripte schreiben
    for (const [name, content] of Object.entries(scriptContents)) {
        await ns.write(name, content, "w");
    }

    // Netzwerk scannen und Liste der Server abrufen
    await ns.run("network-scan.js");
    await ns.sleep(2000);
    const servers = await ns.read("network-scan-output.txt").split(",");

    // Helferfunktion zum Öffnen von Ports
    function openPorts(server) {
        let openPorts = 0;
        if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); openPorts++; }
        if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); openPorts++; }
        if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server); openPorts++; }
        if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); openPorts++; }
        if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); openPorts++; }
        return openPorts;
    }

    // Root-Zugriff auf Server sicherstellen
    for (let server of servers) {
        if (!ns.hasRootAccess(server)) {
            try {
                const portsRequired = ns.getServerNumPortsRequired(server);
                const portsOpened = openPorts(server);
                if (portsOpened >= portsRequired) {
                    ns.nuke(server);
                } else {
                    ns.run("log-output.js", 1, "main", "Not enough ports to nuke " + server + ". Ports required: " + portsRequired + ", Ports opened: " + portsOpened);
                }
            } catch (error) {
                ns.run("log-output.js", 1, "main", "Failed to gain root access to " + server + ": " + error);
            }
        }
    }

    // Server kaufen und Skripte deployen
    await ns.run("automate-purchase.js", 1, ram);
    await ns.sleep(10000);

    // Bestes Ziel initialisieren
    await ns.run("find-best-target.js");
    await ns.sleep(10000);

    // Skripte auf allen Servern kopieren und ausführen
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            for (const script of scriptNames) {
                await ns.scp(script, server);
            }
        }
    }

    // Haupt-Hack-Skript auf allen Servern ausführen
    for (const server of servers) {
        if (ns.hasRootAccess(server)) {
            const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            const threads = Math.floor(availableRam / ns.getScriptRam("hack-template.js"));
            const target = await ns.read(targetFile).trim();
            if (threads > 0 && target) {
                ns.exec("hack-template.js", server, threads, target);
            }
        }
    }

    // Watchdog starten
    ns.run("watchdog.js");

    // Task-Monitor starten
    ns.run("task-monitor.js");

    // Stat-Monitor starten
    ns.run("stat-monitor.js");

    // Find-best-target Skript starten für dynamische Zielsuche
    ns.run("find-best-target.js");
}
