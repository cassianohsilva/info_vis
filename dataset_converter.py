#!/usr/bin/python3

import numpy as np
import pandas as pd


def main():
	# dataset = pd.read_csv('node_modules/world-atlas/world/node_modules/world-atlas/world/110m.tsv')
	df = pd.read_csv(
		'data/original_dataset.csv',
		# header='infer',
		delimiter=',',
		dtype='str')

	# Rename columns
	df.columns = ['year','country','origin','type','value']

	# Ignore first rows
	df = df.iloc[3:]

	# Convert year to numeric type
	df['year'] = df['year'].astype(int)

	df = df[df['year'] >= 1995]

	# Fix '*' values and convert to numeric type
	df = df.replace({'value': '*'}, '-1')
	df['value'] = df['value'].astype(int)


	##################################################
	################# Countries data #################
	##################################################
	
	df2 = pd.read_csv(
		'node_modules/world-atlas/world/50m.tsv',
		header='infer',
		delimiter='\t')

	df2.set_index('iso_n3', inplace=True)

	misc = {
		# Countries with different names
		"Bolivia (Plurinational State of)": 68,
		"Central African Rep.": 140,
		"China, Hong Kong SAR": 344,
		"China, Macao SAR": 446,
		"Congo": 178,
		"Czech Rep.": 203,
		"Dem. People's Rep. of Korea": 408,
		"Dem. Rep. of the Congo": 180,
		"Dominican Rep.": 214,
		"Gambia": 270,
		"Iran (Islamic Rep. of)": 364,
		"Lao People's Dem. Rep.": 418,
		"Micronesia (Federated States of)": 584,
		"Rep. of Korea": 410,
		"Rep. of Moldova": 498 ,
		"Serbia and Kosovo (S/RES/1244 (1999))": 688,
		"Sint Maarten (Dutch part)": 534,
		"State of Palestine": 275,
		"Palestinian": 275,
		"Syrian Arab Rep.": 760,
		"The former Yugoslav Republic of Macedonia": 807,
		"United Rep. of Tanzania": 834,
		"United States of America": 840,
		"Venezuela (Bolivarian Republic of)": 862,
		"Viet Nam": 704,

		# Countries that not appear
		"Bonaire" : 0,
		"Cabo Verde" : 0,
		"French Guiana": 0,
		"Gibraltar": 0,
		"Guadeloupe": 0,
		"Holy See (the)": 0,
		"Martinique": 0,
		"Saint-Pierre-et-Miquelon": 0,
		"Sao Tome and Principe": 0,
		"Svalbard and Jan Mayen": 0,
		"Tibetan": 0,
		"Tuvalu": 0,
		"Wallis and Futuna Islands ": 0,

		# Unkown origins
		"Stateless": -1,
		"Various/Unknown": -2,
	}

	countries = np.unique([df['country'], df['origin']])

	df3 = pd.DataFrame(columns=['id', 'name'], dtype='str')
	df3['id'] = df3['id'].astype(int)

	for i in countries:

		row = df2[df2.name_long == i]

		t = [[row.index[0] if row.shape[0] > 0 else 0, i]]

		if t[0][0] <= 0:
			t[0] = [ misc[t[0][1]], t[0][1] ]
			
		temp = pd.DataFrame(
			t,
			columns=['id', 'name'])

		df3 = pd.concat([df3, temp], ignore_index=True)


	names = df3['name'].tolist()
	ids = df3['id'].tolist()

	types = np.unique(df['type'])
	df4 = pd.DataFrame(types, columns=['name'])
	df4['id'] = (df4.index + 1).copy()

	df['country'] = df['country'].replace(to_replace=names, value=ids)
	df['origin'] = df['origin'].replace(to_replace=names, value=ids)

	df['country'] = df['country'].astype(int)
	df['origin'] = df['origin'].astype(int)

	df = df[df.country != 0]
	df = df[df.origin != 0]

	df['type'] = df['type'].replace(to_replace=df4['name'].tolist(), value=df4['id'].tolist())

	df.to_csv('data/dataset.csv', index=False)
	df4.to_csv('data/types.csv', index=False, columns=['id', 'name'])


if __name__ == '__main__':
	main()