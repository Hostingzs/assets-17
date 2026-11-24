"use strict";
// Import any other script files here, e.g.:
// import * as myModule from "./mymodule.js";
// let wave_json: any;
let enemy_waves;
// let enemy_stats_json: any;
let enemy_stats;
let spawnners;
let heli_spawnners;
let car_spawnners;
let destinations;
let heli_car_destinations;
let initialized = false;
let is_car = false;
let is_heli = false;
let last_sub_seq;
let car_heli_wave_update = false;
runOnStartup(async (runtime) => {
    // Code to run on the loading screen.
    // Note layouts, objects etc. are not yet available.
    runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});
async function OnBeforeProjectStart(runtime) {
    // Code to run just before 'On start of layout' on
    // the first layout. Loading has finished and initial
    // instances are created and available to use here.
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'poki-sdk.js';
    document.head.appendChild(script);
    script.onload = () => {
        runtime.globalVars.poki_sdk_loaded = true;
        console.log('Poki SDK loaded successfully!');
    };
    let style = document.createElement('style');
    style.textContent = "canvas { -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none user-select: none; }";
    document.head.appendChild(style);
    enemy_waves = await runtime.assets.fetchJson('waves.json');
    enemy_stats = await runtime.assets.fetchJson('enemy_type.json');
    runtime.addEventListener("tick", () => Tick(runtime));
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function heli_arrived(runtime, current_enemy, stats) {
    for (const [enemy, count] of Object.entries(current_enemy[0].heli)) {
        if (enemy == "meele") {
            createMeeleEnemy(runtime, count, "heli");
        }
    }
}
function createHeli(runtime) {
    let heli_enemies = enemy_waves.wave[runtime.globalVars.current_wave].heli_enemies;
    let enemies = heli_enemies[getRandomInt(0, heli_enemies.length)];
    let heli = null;
    let stats = null;
    let spawn_point = null;
    let destination_point = null;
    let template_name = "";
    is_heli = true;
    runtime.globalVars.is_car_or_heli = 1;
    switch (enemies) {
        case "heli_noob":
            stats = enemy_stats.heli[0];
            template_name = "heli_noob";
            break;
    }
    spawn_point = getRandomInt(0, heli_spawnners.length);
    destination_point = getRandomInt(0, heli_car_destinations.length);
    heli = runtime.objects.heli_base.createInstance("enemies", heli_spawnners[spawn_point].x, heli_spawnners[spawn_point].y, true, template_name);
    heli.zElevation = runtime.globalVars.heli_zelevation;
    heli.behaviors.MoveTo.maxSpeed = stats.speed;
    heli.behaviors.MoveTo.moveToPosition(heli_car_destinations[destination_point].x, heli_car_destinations[destination_point].y);
}
function createCarEnemy(runtime) {
    let car_enemies = enemy_waves.wave[runtime.globalVars.current_wave].car_enemies;
    let enemies = car_enemies[getRandomInt(0, car_enemies.length)];
    let car = null;
    let stats = null;
    let spawn_point = null;
    let destination_point = null;
    let template_name = "";
    is_car = true;
    runtime.globalVars.is_car_or_heli = 1;
    switch (enemies) {
        case "car_noob":
            stats = enemy_stats.car[0];
            template_name = "car_noob";
            break;
    }
    spawn_point = getRandomInt(0, car_spawnners.length);
    destination_point = getRandomInt(0, heli_car_destinations.length);
    car = runtime.objects.car.createInstance("enemies", car_spawnners[spawn_point].x, car_spawnners[spawn_point].y, false, template_name);
    car.behaviors.MoveTo.maxSpeed = stats.speed;
    car.behaviors.MoveTo.moveToPosition(heli_car_destinations[destination_point].x, heli_car_destinations[destination_point].y);
}
function createMeeleEnemy(runtime, num_of_enemies, source) {
    let stats = null;
    let spawn_point = null;
    let spawn_x = 0;
    let spawn_y = 0;
    let destination_point = null;
    let enemy = null;
    let template_name = "";
    for (let i = 0; i < num_of_enemies; i++) {
        let melee_enemies = enemy_waves.wave[runtime.globalVars.current_wave].meele_enemies;
        let enemies = melee_enemies[getRandomInt(0, melee_enemies.length)];
        switch (enemies) {
            case "noob":
                stats = enemy_stats.meele[0];
                template_name = "noob";
                break;
            case "noob_1":
                stats = enemy_stats.meele[1];
                template_name = "noob_1";
                break;
            case "noob_2":
                stats = enemy_stats.meele[2];
                template_name = "noob_2";
                break;
        }
        if (source == "spawn_point") {
            spawn_point = getRandomInt(0, spawnners.length);
            spawn_x = spawnners[spawn_point].x;
            spawn_y = spawnners[spawn_point].y;
            runtime.globalVars.is_car_or_heli = 0;
        }
        if (source == "heli") {
            let heli = runtime.objects.heli_base.getFirstInstance();
            spawn_x = heli.x + getRandomInt(-10, 10);
            spawn_y = heli.y + getRandomInt(-10, 10);
        }
        if (source == "car") {
            let car = runtime.objects.car.getFirstInstance();
            spawn_x = car.x + getRandomInt(-10, 10);
            spawn_y = car.y + getRandomInt(-10, 10);
        }
        destination_point = getRandomInt(0, destinations.length);
        enemy = runtime.objects.enemy.createInstance("enemies", spawn_x, spawn_y, false, template_name);
        // 				enemy.behaviors.Pathfinding.maxSpeed = stats.speed
        // if(source == "heli")
        // {
        // 	enemy.instVars.parent = "heli" ;
        // }
        enemy.instVars.parent = source;
        enemy.behaviors.MoveTo.maxSpeed = stats.speed;
        enemy.instVars.health = stats.health;
        enemy.instVars.health_decay_rate = stats.health_decay_rate;
        enemy.instVars.attack_strength = stats.attack_strength;
        // 				enemy.behaviors.Pathfinding.findPath(destinations[destination_point].x, destinations[destination_point].y + getRandomInt(-100, 100))
        if (source != "heli") {
            enemy.behaviors.MoveTo.moveToPosition(destinations[destination_point].x, getRandomInt(500, 1030));
        }
    }
}
function createShooterEnemy(runtime, num_of_enemies, source) {
    let stats = null;
    let spawn_point = null;
    let destination_point = null;
    let enemy = null;
    let template_name = "";
    let spawn_x = 0;
    let spawn_y = 0;
    for (let i = 0; i < num_of_enemies; i++) {
        let shooter_enemies = enemy_waves.wave[runtime.globalVars.current_wave].shooter_enemies;
        let enemies = shooter_enemies[getRandomInt(0, shooter_enemies.length)];
        switch (enemies) {
            case "shooter":
                stats = enemy_stats.shooter[0];
                template_name = "shooter";
                break;
            case "shooter_1":
                stats = enemy_stats.shooter[1];
                template_name = "shooter_1";
                break;
            case "shooter_2":
                stats = enemy_stats.shooter[2];
                template_name = "shooter_2";
                break;
        }
        if (source == "spawn_point") {
            spawn_point = getRandomInt(0, spawnners.length);
            spawn_x = spawnners[spawn_point].x;
            spawn_y = spawnners[spawn_point].y;
            runtime.globalVars.is_car_or_heli = 0;
        }
        if (source == "car") {
            let car = runtime.objects.car.getFirstInstance();
            spawn_x = car.x + getRandomInt(-10, 10);
            spawn_y = car.y + getRandomInt(-10, 10);
        }
        if (source == "heli") {
            let heli = runtime.objects.heli_base.getFirstInstance();
            spawn_x = heli.x + getRandomInt(-100, 100);
            spawn_y = heli.y + getRandomInt(-100, 100);
        }
        destination_point = getRandomInt(0, destinations.length);
        enemy = runtime.objects.enemy.createInstance("enemies", spawn_x, spawn_y, false, template_name);
        enemy.instVars.parent = source;
        // 			enemy.behaviors.Pathfinding.maxSpeed = stats.speed
        enemy.behaviors.MoveTo.maxSpeed = stats.speed;
        enemy.instVars.health = stats.health;
        enemy.instVars.fire_rate = stats.fire_rate;
        enemy.instVars.health_decay_rate = stats.health_decay_rate;
        enemy.instVars.attack_strength = stats.attack_strength;
        // 			enemy.behaviors.Pathfinding.findPath(destinations[destination_point].x - getRandomInt(50,300), getRandomInt(500, 1030))
        if (source != "heli") {
            enemy.behaviors.MoveTo.moveToPosition(destinations[destination_point].x - getRandomInt(50, 300), getRandomInt(500, 1030));
        }
    }
}
function update_waves(runtime) {
    let current_enemy = enemy_waves.wave[runtime.globalVars.current_wave].sequence[runtime.globalVars.current_wave_sub_seq];
    let are_all_enemies_dead = runtime.objects.enemy.getFirstInstance();
    runtime.globalVars.sequence_length = enemy_waves.wave[runtime.globalVars.current_wave].sequence.length - 1;
    // && are_all_enemies_dead == null
    if (current_enemy.length == 1) {
        for (const [enemy, count] of Object.entries(current_enemy[0])) {
            if (enemy == "meele") {
                createMeeleEnemy(runtime, count, "spawn_point");
            }
            if (enemy == "shooter") {
                createShooterEnemy(runtime, count, "spawn_point");
            }
            if (enemy == "heli") {
                if (runtime.objects.heli_base.getFirstInstance() == null) {
                    createHeli(runtime);
                }
            }
            if (enemy == "car") {
                if (runtime.objects.car.getFirstInstance() == null) {
                    createCarEnemy(runtime);
                }
            }
            if (enemy == "finished" && are_all_enemies_dead == null) {
                runtime.globalVars.simulate = 0;
                runtime.globalVars.sequence_length = 0;
                runtime.globalVars.current_wave += 1;
                runtime.globalVars.current_wave_sub_seq = -1;
                runtime.globalVars.start = 1;
            }
        }
    }
    //||are_all_enemies_dead == null
    else if (runtime.objects.car.getFirstInstance() != null) {
        for (const [enemy, count] of Object.entries(current_enemy[0])) {
            if (enemy == "meele") {
                createMeeleEnemy(runtime, count, "spawn_point");
            }
            if (enemy == "shooter") {
                createShooterEnemy(runtime, count, "spawn_point");
            }
            if (enemy == "car") {
                if (runtime.objects.car.getFirstInstance() == null) {
                    createCarEnemy(runtime);
                }
            }
        }
    }
}
function Tick(runtime) {
    //return car
    // console.log(runtime.globalVars.json_load_complete);
    if (runtime.globalVars.simulate <= 0 || runtime.globalVars.tutorial < 7) {
        runtime.globalVars.current_wave_sub_seq = 0;
        return;
    }
    // 	if(runtime.objects.enemy.getAllInstances().length <= 2)
    // 	{
    last_sub_seq = runtime.globalVars.current_wave_sub_seq;
    // 	}
    if (runtime.globalVars.car_dest_reached == -1) {
        let spawn_point = getRandomInt(0, car_spawnners.length);
        runtime.objects.car.getFirstInstance().behaviors.MoveTo.moveToPosition(car_spawnners[spawn_point].x, car_spawnners[spawn_point].y);
        runtime.globalVars.car_dest_reached = -2;
    }
    if (runtime.globalVars.heli_reached == -1) {
        let spawn_point = getRandomInt(0, heli_spawnners.length);
        runtime.objects.heli_base.getFirstInstance().behaviors.MoveTo.moveToPosition(heli_spawnners[spawn_point].x, heli_spawnners[spawn_point].y);
        runtime.globalVars.heli_reached = -2;
    }
    if (runtime.globalVars.car_dest_reached == 1) {
        let current_enemy = enemy_waves.wave[runtime.globalVars.current_wave].sequence[last_sub_seq];
        for (const [enemy, count] of Object.entries(current_enemy[0].car)) {
            if (enemy == "meele") {
                createMeeleEnemy(runtime, count, "car");
            }
            if (enemy == "shooter") {
                createShooterEnemy(runtime, count, "car");
            }
        }
        runtime.globalVars.car_dest_reached = -1;
    }
    if (runtime.globalVars.heli_reached == 1) {
        let current_enemy = enemy_waves.wave[runtime.globalVars.current_wave].sequence[last_sub_seq];
        for (const [enemy, count] of Object.entries(current_enemy[0].heli)) {
            if (enemy == "meele") {
                createMeeleEnemy(runtime, count, "heli");
            }
            if (enemy == "shooter") {
                createShooterEnemy(runtime, count, "heli");
            }
        }
        runtime.globalVars.heli_reached = -1;
    }
    // 	console.log("initialized: ", initialized, "car_instance: ", runtime.objects.car.getFirstInstance() == null, "is_car: ", is_car)
    if (initialized && runtime.objects.car.getFirstInstance() == null && is_car) {
        is_car = false;
        runtime.globalVars.current_wave_sub_seq += 1;
        car_heli_wave_update = true;
    }
    if (initialized && runtime.objects.heli_base.getFirstInstance() == null && is_heli) {
        is_heli = false;
        runtime.globalVars.current_wave_sub_seq += 1;
        car_heli_wave_update = true;
    }
    if (initialized && (runtime.objects.enemy.getAllInstances().length <= 4)) {
        if (enemy_waves.wave.length - 1 < runtime.globalVars.current_wave) {
            auto_wave_gen(runtime);
        }
        update_waves(runtime);
        if (!is_car && !is_heli) {
            if (last_sub_seq == 0 && runtime.globalVars.start == 1) {
                runtime.globalVars.start = 0;
            }
            else if (!car_heli_wave_update && runtime.globalVars.current_wave < enemy_waves.wave.length && enemy_waves.wave[runtime.globalVars.current_wave].sequence.length > runtime.globalVars.current_wave_sub_seq + 1) {
                runtime.globalVars.current_wave_sub_seq += 1;
            }
            car_heli_wave_update = false;
        }
    }
    // if (!initialized && runtime.globalVars.json_load_complete == 2) {
    if (!initialized) {
        // wave_json = runtime.objects.wave.getFirstInstance();
        // enemy_waves = wave_json.getJsonDataCopy();
        // enemy_stats_json = runtime.objects.enemy_type.getFirstInstance();
        // enemy_stats = enemy_stats_json.getJsonDataCopy();
        // console.log("*********", enemy_stats);
        spawnners = runtime.objects.spwn_point.getAllInstances();
        heli_spawnners = runtime.objects.heli_spawnner.getAllInstances();
        car_spawnners = runtime.objects.car_spawner.getAllInstances();
        destinations = runtime.objects.path_disabler_start.getAllInstances();
        heli_car_destinations = runtime.objects.heli_car_dest.getAllInstances();
        initialized = true;
    }
}
function auto_wave_gen(runtime) {
    let wave_length = getRandomInt(10, 20);
    let wave_arr = [];
    for (let i = enemy_waves.wave.length; i < runtime.globalVars.current_wave; i++) {
        enemy_waves.wave.push([]);
    }
    for (let i = 0; i < wave_length; i++) {
        let enemies = ['shooter', 'meele', 'car', 'heli'];
        let curr_enemy_type = getRandomInt(0, 4);
        if (enemies[curr_enemy_type] == 'car') {
            let enemy_arr = { "car": { "meele": getRandomInt(2, 5), "shooter": getRandomInt(2, 5) } };
            wave_arr.push([enemy_arr]);
        }
        else if (enemies[curr_enemy_type] == 'heli') {
            let enemy_arr = { "heli": { "meele": getRandomInt(2, 5), "shooter": getRandomInt(2, 5) } };
            wave_arr.push([enemy_arr]);
        }
        else {
            let count = getRandomInt(2, 6);
            let enemy_arr = {
                [enemies[curr_enemy_type]]: count,
            };
            wave_arr.push([enemy_arr]);
        }
    }
    let curr_wave = runtime.globalVars.current_wave;
    wave_arr.push([{ "finished": 1 }]);
    enemy_waves.wave[curr_wave] = {
        "sequence": wave_arr,
        "heli_enemies": ["heli_noob"],
        "car_enemies": ["car_noob"],
        "meele_enemies": ["noob", "noob_1", "noob_2"],
        "shooter_enemies": ["shooter", "shooter_1"]
    };
}
