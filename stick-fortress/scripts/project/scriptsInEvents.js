let reward_purpose = "";
function initPokiSDK(runtime)
{
    window.PokiSDK.init().then(() => {
        console.log("Poki SDK successfully initialized");
        runtime.globalVars.poki_sdk_initialized = true;
        // fire your function to continue to game
    }).catch(() => {
        console.log("Initialized, something went wrong, load you game anyway");
        runtime.globalVars.poki_sdk_initialized = true;
        // fire your function to continue to game
    });
}

function gameLoadingFinished()
{
    // fire loading function here
    window.PokiSDK.gameLoadingFinished();
}

function gameplayStart()
{
    window.PokiSDK.gameplayStart();
}

function gameplayStop()
{
    window.PokiSDK.gameplayStop();

}

function commercialBreak(runtime)
{
    // pause your game here if it isn't already
    runtime.globalVars.pause = 1;
	runtime.globalVars.isAdPlaying = 1;
    window.PokiSDK.commercialBreak(() => {
        // you can pause any background music or other audio here
    }).then(() => {
        console.log("Commercial break finished, proceeding to game");
        runtime.globalVars.pause = -1;
		runtime.globalVars.isAdPlaying = 0;
        gameplayStart();
        // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
        // continue your game here
    });
  
}

function rewardedBreak(runtime, purpose)
{
    // pause your game here if it isn't already
    reward_purpose = purpose;
    runtime.globalVars.pause = 1;
	runtime.globalVars.isAdPlaying = 1;
    window.PokiSDK.rewardedBreak(() => {
        // you can pause any background music or other audio here
    }).then((success) => {
        if(success) {
            // video was displayed, give reward
            if(reward_purpose == "2x_coins")
            {
                runtime.globalVars.coin += runtime.globalVars.wave_complete_coins;
            }
            if(reward_purpose == "retry_coins")
            {
                runtime.globalVars.coin += runtime.globalVars.retry_coin;
            }
            if(reward_purpose == "ad_coin")
            {
                runtime.globalVars.coin += runtime.globalVars.ad_coin;
            }
			if(reward_purpose == "ad_bomb")
            {
                runtime.globalVars.bomb_count += runtime.globalVars.ad_bomb;
				runtime.globalVars.bomb_ad_timer = 3;
				if(runtime.objects.bob_ad_timer_text.getFirstInstance() != null)
				runtime.objects.bob_ad_timer_text.getFirstInstance().destroy();
            }
            
        } else {
            // video not displayed, should not give reward
            if(reward_purpose == "ad_bomb")
            {
				if(runtime.objects.bob_ad_timer_text.getFirstInstance() != null)
				runtime.objects.bob_ad_timer_text.getFirstInstance().destroy();
            }
        }
        // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
        runtime.objects.coin_txt_ui.getFirstInstance().text = runtime.globalVars.coin + " K";
		runtime.objects.bomb_count_ui.getFirstInstance().text = String(runtime.globalVars.bomb_count);
        gameplayStart();
        runtime.globalVars.pause = -1;
		runtime.globalVars.reward_sound = 1;
		runtime.globalVars.isAdPlaying = 0;
        console.log("Rewarded break finished, proceeding to game");
        // continue your game here
    });
}



const scriptsInEvents = {

	async Game_Event2_Act1(runtime, localVars)
	{
		initPokiSDK(runtime);
	},

	async Game_Event10_Act3(runtime, localVars)
	{
		gameLoadingFinished();
		// gameplayStart();
	},

	async Game_Event13_Act4(runtime, localVars)
	{
		gameLoadingFinished();
		// gameplayStart();
	},

	async Game_Event628_Act23(runtime, localVars)
	{
		gameplayStop();
	},

	async Game_Event630_Act14(runtime, localVars)
	{
		commercialBreak(runtime);
	},

	async Game_Event636_Act15(runtime, localVars)
	{
		rewardedBreak(runtime, "2x_coins");
	},

	async Game_Event673_Act1(runtime, localVars)
	{
		gameplayStop();
		rewardedBreak(runtime, "ad_coin");
	},

	async Nuke_Event33_Act1(runtime, localVars)
	{
		console.log('Developed with ❤️ by Syder Studio, Published by KoolGames');
	},

	async Nuke_Event42_Act16(runtime, localVars)
	{
		gameplayStop();
	},

	async Nuke_Event44_Act14(runtime, localVars)
	{
		commercialBreak(runtime)
		
	},

	async Nuke_Event45_Act19(runtime, localVars)
	{
		rewardedBreak(runtime, "retry_coins");
	},

	async Nuke_Event53_Act2(runtime, localVars)
	{
		gameplayStart();
	},

	async Nuke_Event59_Act1(runtime, localVars)
	{
		gameplayStop();
		rewardedBreak(runtime, "ad_bomb");
	},

	async Save_load_state_Event1_Act1(runtime, localVars)
	{
		let player_stand = runtime.objects.stand_player.getAllInstances();
		let child_stick_index = 2
		let wall = runtime.objects.wall_block.getFirstInstance();
		let save_dict = {
			"coin": runtime.globalVars.coin,
			"wave": runtime.globalVars.current_wave,
			"wall_health": wall.instVars.health,
			"wall_total_health": wall.instVars.total_health,
			"wall_current_level": runtime.objects.btn_wall_upgrade.getFirstInstance().instVars.current_level,
			"bomb_count": runtime.globalVars.bomb_count,
		}
		for(let i=0; i<player_stand.length; i++)
			{
				let child_stick = player_stand[i].getChildAt(child_stick_index)
				if(child_stick != null)
					{
						save_dict[player_stand[i].uid] = {
															"level": child_stick.instVars.level,
															"health": child_stick.instVars.health,
															"rate": child_stick.instVars.rate,
															"damage": child_stick.instVars.damage,
															"accuracy": child_stick.instVars.accuracy,
															"health_level": child_stick.instVars.health_level
														}
					}
			}
		runtime.globalVars.save_state = JSON.stringify(save_dict)
	},

	async Save_load_state_Event3_Act1(runtime, localVars)
	{
		let state = JSON.parse(runtime.globalVars.save_state);
		let player_stand = runtime.objects.stand_player.getAllInstances();
		let wall = runtime.objects.wall_block.getFirstInstance();
		
		runtime.globalVars.coin = state.coin;
		runtime.globalVars.bomb_count = state.bomb_count;
		runtime.objects.btn_wall_upgrade.getFirstInstance().instVars.current_level = state.wall_current_level;
		runtime.globalVars.current_wave = state.wave;
		wall.instVars.health = state.wall_health;
		wall.instVars.total_health = state.wall_total_health;
		for(let i=0; i<player_stand.length; i++)
			{
				if(player_stand[i].uid in state)
					{
						let player = state[player_stand[i].uid];
						let player_inst = runtime.objects.stick.createInstance("extra", player_stand[i].x, player_stand[i].y, true);
						player_stand[i].addChild(player_inst, false, false, false, false, false, false, false, false, true);
						player_stand[i].instVars.id = 1;
						player_inst.instVars.level = player.level
						player_inst.instVars.health = player.health;
						player_inst.instVars.rate = player.rate;
						player_inst.instVars.damage = player.damage;
						player_inst.instVars.accuracy = player.accuracy;
						player_inst.instVars.health_level = player.health_level;
						runtime.globalVars.state_loaded = 1;
					}
			}
	},

	async Pause_Event5_Act1(runtime, localVars)
	{
		gameplayStart();
	},

	async Pause_Event6_Act1(runtime, localVars)
	{
		gameplayStop();
	},

	async Pause_Event8_Act1(runtime, localVars)
	{
		gameplayStart();
	},

	async Pause_Event9_Act1(runtime, localVars)
	{
		gameplayStop();
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

