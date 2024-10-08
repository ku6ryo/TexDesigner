export enum NodeTypeId {
  // Input
  InputUv = "input_uv",
  InputVertexPosition = "input_vertex_position",
  InputFloat = "input_float",
  InputVector2 = "input_vector2",
  InputVector3 = "input_vector3",
  InputVector4 = "input_vector4",
  InputTexture = "input_texture",
  InputTextureSampling = "input_texture_sampling",
  InputTime = "input_time",
  InputColor = "input_color",
  InputNormal = "input_normal",
  // Math
  MathAdd = "math_add",
  MathMultiply = "math_multiply",
  MathSubtract = "math_subtract",
  MathFrac = "math_frac",
  MathDot = "math_dot",
  MathClamp = "math_clamp",
  MathSine = "math_sine",
  MathCosine = "math_cosine",
  MathTangent = "math_tangent",
  MathArcsine = "math_arcsine",
  MathArccosine = "math_arccosine",
  MathArctangent = "math_arctangent",
  MathCombine = "math_combine",
  MathSeparate = "math_separate",
  MathGreaterThan = "math_greaterThan",
  MathLessThan = "math_lessThan",
  MathVectorRotate = "math_vectorRotate",
  MathInvert = "math_invert",
  MathCross = "math_cross",
  MathNormalize = "math_normalize",
  MathLength = "math_length",
  MathDistance = "math_distance",
  MathAbs = "math_abs",
  MathSign = "math_sign",
  MathFloor = "math_floor",
  MathCeil = "math_ceil",
  MathMix = "math_mix",
  MathMin = "math_min",
  MathMax = "math_max",
  MathMod = "math_mod",
  MathStep = "math_step",
  MathSmoothstep = "math_smoothstep",
  MathDivide = "math_divide",
  MathPow = "math_pow",
  MathExp = "math_exp",
  MathLog = "math_log",
  MathExp2 = "math_exp2",
  MathLog2 = "math_log2",
  MathSqrt = "math_sqrt",
  MathRadians = "math_radians",
  MathDegrees = "math_degrees",
  MathReflect = "math_reflect",
  MathRefract = "math_refract",
  // Output
  OutputColor = "output_color",
  // Noise
  NoisePerlinNoise = "texture_perlin_noise",
  NoiseVolonoi = "texture_volonoi",
  NoiseWhilteNoise = "noise_whilte_noise",
  NoiseWhilteNoise2D = "noise_whilte_noise_2d",
}
