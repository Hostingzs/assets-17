


const scriptsInEvents = {

	async Loadingandpokiinit_Event15_Act1(runtime, localVars)
	{
		runtime.globalVars.PokiHasInitialised = globalThis.PokiHasInitialised;
	},

	async Loadingandpokiinit_Event15_Act2(runtime, localVars)
	{
		runtime.globalVars.AdBlockerDetect = globalThis.AdBlockerDetect;
	},

	async Loadingandpokiinit_Event22_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStart();
		console.log("Gameplay has started");
	},

	async Loadingandpokiinit_Event24_Act1(runtime, localVars)
	{
		PokiSDK.gameplayStop();
		console.log("Gameplay has stoped");
	},

	async Loadingandpokiinit_Event25_Act1(runtime, localVars)
	{
		PokiSDK.gameLoadingStart();
		console.log ("Game loading has started");
	},

	async Loadingandpokiinit_Event26_Act1(runtime, localVars)
	{
		PokiSDK.gameLoadingFinished();
		console.log ("Game loading has finished");
	},

	async Loadingandpokiinit_Event30_Act4(runtime, localVars)
	{
		PokiSDK.rewardedBreak(() => {
		//antes de ejecutar
		window.ad
		}).then(
		    (success) => {
		        if(success) {
		          // video was displayed, give reward
				  runtime.globalVars.GmIsPaused = false;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  // ad reward
				  // put funcion reward
				   runtime.callFunction("BackFromRewardAdMultiply");
				
		        }
		        else {
		          // video not displayed, should probably not give reward
				 
				 runtime.globalVars.GmIsPaused = false;
				 runtime.globalVars.PokiIsPlayingRewardedAd=false;
				 runtime.callFunction("FailedAD");
		        }
				// aqui funciones de cuando termina la 
				
		    }
			
		);
	},

	async Loadingandpokiinit_Event33_Act4(runtime, localVars)
	{
		PokiSDK.rewardedBreak(() => {
		//antes de ejecutar
		window.ad
		}).then(
		    (success) => {
		        if(success) {
		          // video was displayed, give reward
				  runtime.globalVars.GmIsPaused = false;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  // ad reward
				  // put funcion reward
				   runtime.callFunction("BackFromRewardAdAnotherChance");
				
		        }
		        else {
		          // video not displayed, should probably not give reward
				 
				 runtime.globalVars.GmIsPaused = false;
				 runtime.globalVars.PokiIsPlayingRewardedAd=false;
				 runtime.callFunction("FailedAD");
		        }
				// aqui funciones de cuando termina la 
				
		    }
			
		);
	},

	async Loadingandpokiinit_Event36_Act5(runtime, localVars)
	{
		PokiSDK.rewardedBreak(() => {
		//antes de ejecutar
		window.ad
		}).then(
		    (success) => {
		        if(success) {
		          // video was displayed, give reward
				  runtime.globalVars.GMISPaused = false;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  // ad reward
				  // put funcion reward
				   runtime.callFunction("BackFromRewardAdMoreBoxes");
				
		        }
		        else {
				
		          // video not displayed, should probably not give reward
				 
				 runtime.globalVars.GmIsPaused = false;
				 runtime.globalVars.PokiIsPlayingRewardedAd=false;
				 runtime.callFunction("FailedAD");
		        }
				// aqui funciones de cuando termina la 
				
		    }
			
		);
	},

	async Loadingandpokiinit_Event39_Act5(runtime, localVars)
	{
		PokiSDK.rewardedBreak(() => {
		//antes de ejecutar
		window.ad
		}).then(
		    (success) => {
		        if(success) {
		          // video was displayed, give reward
				  runtime.globalVars.GMISPaused = false;
				  runtime.globalVars.PokiIsPlayingRewardedAd=false;
				  // ad reward
				  // put funcion reward
				   runtime.callFunction("BackFromRewardAdGetSkin");
				
		        }
		        else {
				
		          // video not displayed, should probably not give reward
				 
				 runtime.globalVars.GmIsPaused = false;
				 runtime.globalVars.PokiIsPlayingRewardedAd=false;
				 runtime.callFunction("FailedAD");
		        }
				// aqui funciones de cuando termina la 
				
		    }
			
		);
	},

	async Loadingandpokiinit_Event42_Act4(runtime, localVars)
	{
		PokiSDK.commercialBreak().then(
		    () => {
		        console.log("Commercial break finished, proceeding to game");
				runtime.globalVars.GMISPaused = false;
				runtime.globalVars.PokiPlayingMidrollAd=false;
				runtime.callFunction("BackFromMidroll");
				
		    }
		);
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

