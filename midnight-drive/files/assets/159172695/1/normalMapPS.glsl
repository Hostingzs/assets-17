#ifdef MAPTEXTURE
uniform sampler2D texture_normalMap;
uniform float material_bumpiness;
uniform float uTime;
#endif

void getNormal() {
#ifdef MAPTEXTURE
    vec3 normalMap = unpackNormal(texture2D(texture_normalMap, $UV - uTime + vec2(0, 0.5) , textureBias));
	vec3 normalMap2 = unpackNormal(texture2D(texture_normalMap, $UV + uTime, textureBias));
	normalMap = normalize(mix(vec3(0.0, 0.0, 1.0), mix(normalMap, normalMap2 ,0.5 ), material_bumpiness));
    dNormalW = normalize(dTBN * addNormalDetail(normalMap));
#else
    dNormalW = dVertexNormalW;
#endif
}

