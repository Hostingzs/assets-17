


const scriptsInEvents = {

	async Ui_Event170_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		}).then((success) => {
		    if(success) {
			
			c3_callFunction('getReward');
			
		        // video was displayed, give reward
		    } else {
			
			c3_callFunction('noReward');
			
		        // video not displayed, should not give reward
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
		    // continue your game here
		});
	},

	async Mapevents_Event163_Act1(runtime, localVars)
	{
		// pause your game here if it isn't already
		PokiSDK.rewardedBreak(() => {
		  // you can pause any background music or other audio here
		}).then((success) => {
		    if(success) {
			
			c3_callFunction('getMoneyReward');
			
		        // video was displayed, give reward
		    } else {
			
			c3_callFunction('noMoneyReward');
			
		        // video not displayed, should not give reward
		    }
		    // if the audio was paused you can resume it here (keep in mind that the function above to pause it might not always get called)
		    console.log("Rewarded break finished, proceeding to game");
		    // continue your game here
		});
	},

	async Ads_Event3_Act1(runtime, localVars)
	{
		PokiSDK.commercialBreak().then(
		    () => {
		        console.log('Commercial break finished, proceeding to game');
		        // your code to continue to game
		   //PokiSDK.gameplayStart();     
		  c3_callFunction('unmuteGame');
		
		
		    }
		);
	},

	async LoadEvents_Event12_Act1(runtime, localVars)
	{
		PokiSDK.init().then(
		    () => {
		        console.log('Poki SDK successfully initialized');
		        // your code to continue to game
		        continueToGame();
		
		    }   
		).catch(
		    () => {
		        console.log('Initialized, but the user likely has adblock');
		        // your code to continue to game
		        continueToGame();
		
		    }   
		);
		
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

