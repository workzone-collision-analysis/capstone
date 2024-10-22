## Jupyter Notebooks

Some of these notebooks will require data sets that are not present in the data folder due to GitHub file size upload limits. Please contact us if you are having trouble generating the data sets from the notebooks provided.

To download raw data please follow instructions in each of the following notebooks:
1. lion_00_data_wrangling_&_filtration
2. crash_00_data_wrangling
3. 511_00_data_wrangling
4. wz_00_data_wrangling

Also, data used in some of the notebooks will require data produced by other notebooks. Therefore it is important to run notebooks sequentially and make sure you have the required data in the cleaned data folder. Please follow instructions inside notebooks.

Recommended sequence of running notebooks:
1. lion_00_data_wrangling_&_filtration
2. lion_01_lookup_table_between_LION_Shst
3. shst_00_processing_sharedstreets_geometry
4. shst_01_extract_short_segments
5. shst_02_add_lion_characteristic
6. crash_00_data_wrangling
7. crash_01_data_wrangling_with_shst
8. crash_02_define_Intersection_crash
9. crash_03_counting_crashes
10. crash_04_counting_injured_number
11. 511_00_data_wrangling
12. 511_01_data_wrangling_with_sharedstreets
13. 511_02_counting_crash
14. 511_03_add_lion_attributes
15. 511_04_data_processing_for_clustering
16. wz_00_data_wrangling
17. wz_01_EDA
18. wz_02_counting_crashes
19. wz_03_join_to_511
20. 511_05_features_EDA
21. 511_06_clustering
22. 511_07_clustering_with_length
