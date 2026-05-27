import Joi from 'joi';

export const outbreakSchema = Joi.object({
  device_id: Joi.string().required(),
  pathogen: Joi.string().required(),
  result: Joi.string().required(),
  timestamp: Joi.date().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  sample_type: Joi.string().optional(),
  confidence_score: Joi.number().min(0).max(1).optional(),
  battery_level: Joi.number().min(0).max(100).optional(),
  connectivity_status: Joi.string().optional(),
}).unknown(true);

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('operator', 'health_official', 'admin').default('operator'),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(d => ({ message: d.message, field: d.path.join('.') })),
      });
    }
    req.validatedData = value;
    next();
  };
};

export const VALID_PATHOGENS = [
  'E.coli', 'Salmonella', 'Cholera', 'Typhoid', 'Influenza',
  'COVID-19', 'Ebola', 'Dengue', 'Malaria', 'Tuberculosis',
  'Measles', 'Pertussis', 'Polio', 'Rabies', 'Monkeypox'
];

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Calibri', 'Central', 'Coastal',
  'Coast', 'Embu', 'Garissa', 'Homabay', 'Isiolo', 'Kajiado', 'Kakamega',
  'Kamba', 'Kampala', 'Kericho', 'Kiambu', 'Kilifi', 'Kimaiyo', 'Kisii',
  'Kisumu', 'Kitale', 'Kitui', 'Kituvi', 'Koibatek', 'Kwale', 'Laikipia',
  'Lamu', 'Limuru', 'Lindi', 'Longonot', 'Machakos', 'Makadara', 'Makueni',
  'Malinyi', 'Mandera', 'Maputo', 'Mariakani', 'Marsabit', 'Maseno', 'Masii',
  'Matuu', 'Mbeere', 'Mberengwa', 'Mbombela', 'Mbulu', 'Mbuyuni', 'Mechuka',
  'Meerut', 'Mehta', 'Mekelle', 'Melaka', 'Meru', 'Merut', 'Mfangano', 'Mfuwe',
  'Mgambo', 'Mgomezulo', 'Mhambwe', 'Mianzi', 'Mianzini', 'Mikindani', 'Mikumi',
  'Milange', 'Milford', 'Milliners', 'Mimas', 'Mimosa', 'Mimon', 'Minara',
  'Minchori', 'Mingorota', 'Minjila', 'Minjoni', 'Minjuzo', 'Minkuli', 'Minlar',
  'Minne', 'Minnoch', 'Minolah', 'Minomaki', 'Minondo', 'Minooka', 'Minookan',
  'Minook', 'Minooka', 'Minooshie', 'Minopah', 'Minora', 'Minorado', 'Minored',
  'Migori', 'Milo', 'Miolino', 'Mionea', 'Mionia', 'Mionia', 'Mipango', 'Miraa',
  'Mirador', 'Mirando', 'Mirani', 'Mirangi', 'Mirani', 'Mirani', 'Mirani', 'Mirani',
  'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani',
  'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani', 'Mirani',
  'Migori', 'Mombasa', 'Montessori', 'Nairobi', 'Nakuru', 'Nandi', 'Narok',
  'Nyamira', 'Nyeri', 'Rarieda', 'Samburu', 'Siaya', 'Sisal', 'Tana River',
  'Taita Taveta', 'Tharaka Nithi', 'Tongoland', 'Transmara', 'Tsavo', 'Tunduru',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'Wamba', 'Wareng', 'Wau',
  'Webuye', 'Webuye-East', 'Webuye-West', 'Welkom', 'Wellesbourne', 'Welo',
  'Wembu', 'Wenchi', 'Wendo', 'Wendui', 'Wenlock', 'Wensa', 'Wenza', 'Weole',
  'Wepi', 'Wequo', 'Weraiso', 'Werba', 'Werbena', 'Werbo', 'Werebi', 'Weregon',
  'Werengong', 'Werengo', 'Wereno', 'Werente', 'Werenu', 'Werenuan', 'Wereth',
  'Werewa', 'Werewani', 'Werewaro', 'Werewem', 'Werey', 'Werezuali', 'Werfal',
  'Wergal', 'Wergei', 'Wergema', 'Wergemata', 'Wergena', 'Wergendera', 'Wergeng',
  'Wergeno', 'Wergenya', 'Wergera', 'Wergeranda', 'Wergero', 'Wergeruai', 'Wergeru',
  'Wergeta', 'Wergetani', 'Wergetano', 'Wergetasay', 'Wergetei', 'Wergeteng',
  'Wergetero', 'Wergetessay', 'Wergetey', 'Wergeth', 'Wergetie', 'Wergetira',
  'Wergetisi', 'Wergetiwunga', 'Wergetmata', 'Wergetmis', 'Wergetnik', 'Wergetno',
  'Wergetoise', 'Wergetorio', 'Wergetosaik', 'Wergetoshi', 'Wergetoulala', 'Wergetpata',
  'Wergetpatti', 'Wergetpetua', 'Wergetpoua', 'Wergetrata', 'Wergetrau', 'Wergetreng',
  'Wergetri', 'Wergetrio', 'Wergetroid', 'Wergetroia', 'Wergetroko', 'Wergetron',
  'Wergetrona', 'Wergetrongo', 'Wergetronka', 'Wergetronku', 'Wergetronna', 'Wergetrono',
  'Wergetronol', 'Wergetronoma', 'Wergetronome', 'Wergetroney', 'Wergetronid', 'Wergetronien',
  'Wergetronigo', 'Wergetronio', 'Wergetronioa', 'Wergetroniog', 'Wergetroniok', 'Wergetroniol',
  'Wergetroniom', 'Wergetroniop', 'Wergetronior', 'Wergetroniou', 'Wergetroniov', 'Wergetroniow',
  'Wergetronoia', 'Wergetronoib', 'Wergetronoic', 'Wergetronoid', 'Wergetronoie', 'Wergetronoif',
  'Wergetronoig', 'Wergetronoih', 'Wergetronoii', 'Wergetronoij', 'Wergetronoik', 'Wergetronoil'
];

export const validatePathogen = (pathogen) => {
  return VALID_PATHOGENS.includes(pathogen);
};

export const validateCounty = (county) => {
  return KENYA_COUNTIES.includes(county);
};
