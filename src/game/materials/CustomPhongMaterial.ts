import * as THREE from 'three';

const createCustomPhongMaterial = (
  params: THREE.MeshPhongMaterialParameters,
) => {
  const newMaterial = new THREE.MeshPhongMaterial({
    ...params,
  });
  newMaterial.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_phong_pars_fragment>',
      `varying vec3 vViewPosition;

struct BlinnPhongMaterial {

vec3 diffuseColor;
vec3 specularColor;
float specularShininess;
float specularStrength;

};

void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

float dotNL = abs( dot( vec3( 1.0, 1.0, 1.0 ), vec3( 1.0, 1.0, 1.0 ) ) );
float lightFactor = max( abs( dotNL ), 0.5 );
vec3 irradiance = lightFactor * directLight.color;

reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );


}

void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {

reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

}

#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
    );
  };
  return newMaterial;
};

export default createCustomPhongMaterial;
